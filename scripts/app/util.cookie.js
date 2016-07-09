/** jquery.cookie plugin config */
$.cookie.json = true;
$.extend($.cookie.defaults, { expires: 365, path: '/' });

util.namespace('util.cookie');

/**
 * Manages a named cookie. The cookie is a single cookie
 * that holds a JSON object on which properties are set and retrieved.
 * @module util.cookie
 * @requires JQUERY
 * @requires jquery.cookie
 * @requires util
 */
util.cookie = (function () {

    'use strict';

    var cookieName = 'ats';

    return {

        /**
         * Retrieve value from JSON object store in the cookie.
         * scope and persistId are concatinated to form the property name of
         * the value to retrieve.
         * @param {string} scope - Scope of the value.
         * @param {string} persistId - Id of the value.
         * @param {string} defaultValue - Returned value if the requested property is not found.
         */
        get: function (scope, persistId, defaultValue) {
            var c = $.cookie(cookieName), value;
            if (!c) return defaultValue;
            value = c[scope + persistId];
            if (value) {
                return value;
            } else {
                return defaultValue;
            }
        },

        /**
         * Sets a property on the JSON object stored in the 'util' cookie.
         * scope and persistId are concatinated to form the property name to
         * set the value on in the JSON object.
         * e.g.
         * scope = 'foo', persistId = 'bar', value = 'cat'
         * results in: { foobar: 'cat' }
         *
         * @param {string} scope - Scope for this value.
         * @param {string} persistId - Id for this value.
         * @param {string} value - Value to store.
         */
        set: function (scope, persistId, value) {
            var c = $.cookie(cookieName);
            if (!c) c = {};
            c[scope + persistId] = value;
            $.cookie(cookieName, c);
        }

    };

})();
