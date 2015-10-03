util.namespace('util.updater');

/**
 * Module to handle updating dynamic data on all pages.
 * 
 * Elements with a special data attribute, [data-updater] will have thier
 * contents replaced by the response.
 * 
 * The value of these attributes is expected to be a multipart identifier 
 * parsed on the backend to decided the service used to render the 
 * response data for that particular element.
 * 
 * This module also handles callback function execution on update instead.  
 * Functions are registered and fired as callbacks when new data is 
 * detected for their multipart identifiers.
 *
 * Call util.updater.start to start the updater.
 * 
 * @module util.updater
 * @requires jQuery
 * @requires jQuery.flash
 * @requires util
 */
util.updater = (function () {
    
    /** @type {number} - The ms interval to timeout */
    var _updaterTimeout = null,

        /** @type {number} - last update to store the latest date of update . */
        _lastUpdate = 0,
        
        /** @type {number} - failure count to track number of failures before showing message */
        _failureCount = 0,
        
        /** @type {boolean} - flag used to highlight the elements */
        _disableHighlight = false,
        
        /** @type {Object} - Tracks the registration callback calls with identifier. */
        _callbacks = [],
        
        /** @type {string} - URL */
        _url = '',
        
        /** @type {number} - Delay in milliseconds */ 
        _delay = 4000,

        module,
        
        /**
         * Update the page elements in case anything changed
         * @param {Object} response - Response passed.
         */
        _processResponse = function (response) {
        
            var someValueHasUpdated = false;
            
            _failureCount = 0;
            
            // Update all the [data-updater] elements if the data changed.
            $('[data-updater]').each(function (i, val) {
                
                var elem = $(val), 
                    newData,
                    identifier = elem.attr('data-updater');
                
                if (typeof identifier === 'undefined' || typeof response.data === 'undefined') {
                    return;
                }
                
                newData = response.data[identifier];
                
                if (typeof newData !== 'undefined') {
                    if (elem.html() !== newData) {
                        // Escape html: Creates a div in isolation, sets its text
                        // to whatever's in newData, then effectively escapes it 
                        // via the html function.
                        newData = $('<div>').text(newData).html();
                        elem.html(newData);
                        someValueHasUpdated = true;
                        if (!_disableHighlight) {
                            elem.flash(3.5);
                        }
                    }
                }
            });
            
            _callbacks.forEach(function (it, index, ar) {
                var idMap = it.identifierMap,
                    allIdentifierValues = {},
                    gotNewData = false,
                    isEmpty = function (obj) {
                        for (var prop in obj) {
                            if(obj.hasOwnProperty(prop)) {
                                return false;
                            }
                        }
                        return true;
                    };
                if (('undefined' === typeof idMap || isEmpty(idMap)) && someValueHasUpdated) {
                    (it.callback)();
                    return;
                }
                $.each(idMap, function (key, val) {
                    var newData;
                    if ('undefined' !== typeof response.data) {
                        newData = response.data[idMap[key]];
                        if ('undefined' !== typeof newData) {
                            gotNewData = true;
                            allIdentifierValues[key] = newData;
                        }
                    }
                });
                if (true === gotNewData) {
                    // Fire the callback, passing in the updated values.
                    (it.callback)(allIdentifierValues);
                }
            });

            // Save latest date.
            _lastUpdate = response.toDate;
            // Schedule next update
            if (_updaterTimeout) {
                clearTimeout(_updaterTimeout);
            }
            _updaterTimeout = setTimeout(_doUpdate, _delay);
        },
        
        /**
         * Manage failure to update the page elements
         */
        _failureCallback = function () {
            // something bad happened, show user that updates are off
            _failureCount++;

            // Schedule another update in case the server comes back, but slow it down a bit
            if (_updaterTimeout) {
                clearTimeout(_updaterTimeout);
            }
            _updaterTimeout = setTimeout(_doUpdate, _delay * 2);
            console.log('Date Updater Failure: ' + _failureCount);
            console.log('Trying again in ' + (_delay * 2) + 'ms.');
        },
        
        /**
         * Update items on the page.
         */
        _doUpdate = function () {
            // If none exist on this page, get out.
            // Build up JS object to be used for request
            var reqData = {
                    fromDate : _lastUpdate,
                    requestTokens : []
                },
                getUpdater = function () {
                    var updateElems = $('[data-updater]'),
                        updateData = $.makeArray(updateElems).map(function (al) {
                            return $(al).attr('data-updater');
                        });
                    return updateData;
                };

            var addedData = getUpdater();
            reqData.requestTokens = reqData.requestTokens.concat(addedData);
            
            _callbacks.forEach(function (registration, index) {
                var idMap = registration.identifierMap;
                $.each(idMap, function (key, val) {
                    reqData.requestTokens = reqData.requestTokens.concat(val);
                });
            });

            if (0 === reqData.requestTokens.length) {
                // Schedule next update.
                if (_updaterTimeout) {
                    clearTimeout(_updaterTimeout);
                }
                _updaterTimeout = setTimeout(_doUpdate, _delay);
                return;
            }
            
            $.ajax({
                url: _url,
                type: 'POST',
                data: JSON.stringify(reqData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).done(function (data, textStatus, xhr) {
                _processResponse(data);
            }).fail(function (xhr, textStatus, errorThrown) {
                // Since we're asking for json data, if we get a 200 status, but its not json this will 
                // result in a parse error and call fail(), not done().
                if (xhr.status === 409) {
                    console.log('Update Failed: 409', errorThrown);
                }
                
                _failureCallback();
            });

            reqData.requestTokens = [];
        };
    
    module = {
        
        /**
         * Register a callback function to fire for the provided identifiers.
         * @param {function} callback - Function to fire on update.
         * @param {Object} identifierMap - Identifier Map
         */
        registerCallback: function (callback, identifierMap) {
            _callbacks.push({
                'identifierMap': identifierMap,
                'callback': callback
            });
        },
        
        /**
         * Register a callback that will only fire if the response contains a 'boolean' property 
         * whose value is 'true' or true. Once fired the callback will never be fired again.
         * @param {function} callback - Function to fire on update.
         * @param {DOM id} identifier - Identifier Id
         */
        registerEventCallback: function (callback, identifier) {
            var didIt = false,
                callbackWrapper = function (data) {
                    if (!didIt && (data.boolean === true || data.boolean === 'true')) {
                        didIt = true;
                        callback();
                    }
                };
            module.registerCallback(callbackWrapper, { 'boolean': identifier });
        },
        
        /**
         * Schedules the first update request after waiting 'delay' milliseconds.
         * The first update recursively reschedules consecutive updates from then on.
         * @param {string} url - url
         * @param {number} delay - delay time
         */
        start: function (url, delay) {
            _url = url;
            _delay = delay;
            if (_updaterTimeout) {
                clearTimeout(_updaterTimeout);
            }
            _updaterTimeout = setTimeout(_doUpdate, _delay);
        }
    };
    
    return module;
})();