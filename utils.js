/**
 * Set of utility functions scoped to the 'util' global.
 * @module util
 * @requires jQuery
 */
var util = (function($) {

    var module = {

        /** Support for inheritance: inherit superType's prototype. */
        inheritPrototype: function(subType, superType) {

            var prototype = Object.create(superType.prototype);

            prototype.constructor = subType;
            subType.prototype = prototype;
        },

        /**
         * Namespace function: so we don't have to put all those checks to see if
         * modules exist and either create empty ones or set a reference to one
         * that was previously created.
         * Creates a global namespace.
         * See Zakas, Maintainable JavaScript, pp. 72-73, and Stefanov,
         * Javascript Patterns, pp. 89-90
         */
        namespace: function(ns) {
            var parts = ns.split('.'),
                object = this,
                i, n;

            // Strip parts[0] if it is the initial name.
            // If first element in namespace exists, skip it.
            if (window[parts[0]]) {
                parts = parts.slice(1);
            }

            for (i = 0, n = parts.length; i < n; i++) {
                if (!object[parts[i]]) {
                    object[parts[i]] = {};
                }
                object = object[parts[i]];
            }

            return object;
        },

        /** 
         * Parse the inner text contents of 'selector' as JSON.
         * @param {string} selector - The css selector to the element parse text contents of.
         */
        json: function(selector) {
            return JSON.parse($(selector).text());
        },

        /** Convenient 'do nothing' function that doesn't require an argument like void(0); */
        noop: function() {},

        /** 
         * Return a formatted percent string to the decimal places specified.
         * i.e.
         * util.percent(13, 205, 3) results in "6.341%"
         * util.percent(5, 10, 3) results in "50%"
         * @param {Number} count - The current count of items.
         * @param {Number} total - The total number of items.
         * @param {Number} decimals - The number of decimal places.
         */
        percent: function(count, total, decimals) {
            return Number((count / total * 100).toFixed(decimals)).toString() + '%';
        },

        /** 
         * Returns and array of the values in an object.  
         * It only returns the objects own  values, not those from the prototype chain.
         */
        values: function(obj) {
            var values = Object.keys(obj || {}).map(function(key) {
                return obj[key];
            });

            return values;
        },

        /** General purpose validators */
        validate: {

            /** 
             * Returns true if the supplied latitude is valid, otherwise false.
             * i.e. >= -90 and <= 90, with 6 or less decimal digits
             */
            latitude: function(lat) {
                if (lat > 90 || lat < -90) {
                    return false;
                }
                var validator = /^-?([0-8]?[0-9]|90)\.[0-9]{1,6}$/;
                return validator.test(lat);
            },

            /** 
             * Returns true if the supplied longitude is valid, otherwise false.
             * i.e. >= -180 and <= 180, with 6 or less decimal digits 
             */
            longitude: function(long) {
                if (long > 180 || long < -180) {
                    return false;
                }
                var validator = /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}$/;
                return validator.test(long);
            },

            email: function (email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }

        },

        /**
         * Returns a random number between min (inclusive) and max (exclusive)
         */
        random: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give you a non-uniform distribution.
         */
        randomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /** Retrieve a request parameter by name. */
        getParameterByName: function(name) {

            var regexS,
                regex,
                results;

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            regexS = "[\\?&]" + name + "=([^&#]*)";
            regex = new RegExp(regexS);
            results = regex.exec(window.location.href);

            if (results == null) {
                return null;
            } else {
                return decodeURIComponent(results[1].replace(/\+/g, ' '));
            }
        }

    };

    return module;

};)(window.jQuery);