util.namespace('util.cookie');

/**
 * Module to store data as json in a single cookie.
 * @module util.cookie
 * @requires {object} Cookies - cookies.js plugin.
 */
util.cookie = ((Cookies) => {
  
  'use strict';
  
  let module = {};
  
  let _name = 'ats';
  let _max = 4093;
  
  /**
   * Retrieve value from JSON object store in the cookie.
   * scope and persistId are concatinated to form the property name of
   * the value to retrieve.
   * @param {string} scope - Scope of the value.
   * @param {string} persistId - Id of the value.
   * @param {string} defaultValue - Returned value if the requested property is not found.
   */
  module.get = (scope, persistId, defaultValue) => {
    
    let c = Cookies.getJSON(_name), value;
    if (!c) return defaultValue;
    value = c[`${scope}-${persistId}`] || defaultValue;
    
    return value;
  };
  
  /**
   * Sets a property on the JSON object stored in the 'sn' cookie.
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
  module.set = (scope, persistId, value) => {
    
    let c = Cookies.getJSON(_name) || {};
    c[`${scope}-${persistId}`] = value;
    let stringified = JSON.stringify(c);
    let bytes = util.bytes(stringified);
    if (bytes >= _max) {
      // Cookies.set silently fails in this case :(
      console.error(`Cookie set failed: cookie length (${bytes} bytes) exceeds max (${_max} bytes) `);
    } else {
      Cookies.set(_name, c, { expires: 365 });
    }
    
  };
  
  module.getName = () => _name;
  
  return module;
  
})(window.Cookies);