/**
 * Setup the global 'util' namespace and add some utility functions.
 * @module util
 * @requires jQuery
 */
util = (function($) {

  'use strict';
  
  /** @type {object} -  The public API of this mod. */
  let mod = {};
  
  let _dev_mode = true;
  
  
  
  /* GENERAL
   --------------------------------------------------------------- */
  
  mod.identity = (o) => o;
  mod.noop = () => {};
  
  
  
  /* LOGGING - Console log alias's that only fire when in dev mode.
   --------------------------------------------------------------- */
  
  mod.assert = function (...args) { if (_dev_mode) console.assert.apply(console, args); };
  mod.dir = function (...args) { if (_dev_mode) console.dir.apply(console, args); };
  mod.count = function (...args) { if (_dev_mode) console.count.apply(console, args); };
  mod.log = function (...args) { if (_dev_mode) console.log.apply(console, args); };
  mod.info = function (...args) { if (_dev_mode) console.info.apply(console, args); };
  mod.debug = function (...args) { if (_dev_mode) console.debug.apply(console, args); };
  mod.warn = function (...args) { if (_dev_mode) console.warn.apply(console, args); };
  mod.error = function (...args) { if (_dev_mode) console.error.apply(console, args); };
  
  mod.table = function (...args) { if (_dev_mode && console.table) console.table.apply(console, args); };
  mod.trace = function (...args) { if (_dev_mode && console.trace) console.trace.apply(console, args); };
  mod.group = function (...args) { if (_dev_mode && console.group) console.group.apply(console, args); };
  mod.groupEnd = function (...args) { if (_dev_mode && console.groupEnd) console.groupEnd.apply(console, args); };
  mod.groupCollapsed = function (...args) { if (_dev_mode && console.groupCollapsed) console.groupCollapsed.apply(console, args); };
  mod.profile = function (...args) { if (_dev_mode && console.profile) console.profile.apply(console, args); };
  mod.profileEnd = function (...args) { if (_dev_mode && console.profileEnd) console.profileEnd.apply(console, args); };
  mod.time = function (...args) { if (_dev_mode && console.time) console.time.apply(console, args); };
  mod.timeEnd = function (...args) { if (_dev_mode && console.timeEnd) console.timeEnd.apply(console, args); };
  mod.timeStamp = function (...args) { if (_dev_mode && console.timeStamp) console.timeStamp.apply(console, args); };
  
  
  
  /* STRING UTILS
   --------------------------------------------------------------- */
  
  mod.repeat = (str, times) => (new Array(times + 1)).join(str);
  mod.pad = (num, maxLength) => mod.repeat(`0`, maxLength - num.toString().length) + num;
  mod.replaceAt = (s, i, c) => s.substr(0, i) + c + s.substr(i + 1);
  mod.endsWith = (s, c) => s[s.length -1] === c;
  
  /** Generate a UUID. */
  mod.uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
  
  /** Return the size of a string in bytes assuming UTF-8 encoding. */
  mod.bytes = (str) => {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    let m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  };
  
  /** Lookup i18n strings by key, that have been exposed to fed. */
  mod.message = function (key /*, default */) {
    let message = mod.const.i18n[key];
    if (!message) return arguments[1] || message;
    return message;
  };
  
  
  
  /* NUMBER UTILS
   --------------------------------------------------------------- */
  
  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   */
  mod.random = (min, max) => Math.random() * (max - min) + min;
  
  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution.
   */
  mod.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  
  
  /* OBJECT UTILS
   --------------------------------------------------------------- */
  
  /**
   * Namespace function: so we don't have to put all those checks to see if
   * modules exist and either create empty ones or set a reference to one
   * that was previously created.
   * See Zakas, Maintainable JavaScript, pp. 72-73, and
   * Stefanov, Javascript Patterns, pp. 89-90
   */
  mod.namespace = function(ns) {
    let parts = ns.split('.'),
        object, i, n;
    
    // Start the object if needed.
    if (!window[parts[0]]) {
      window[parts[0]] = {};
    }
    object = window[parts[0]];
    
    for (i = 1, n = parts.length; i < n; i++) {
      if (!object[parts[i]]) {
        object[parts[i]] = {};
      }
      object = object[parts[i]];
    }
    
    return object;
  };
  
  /**
   * Safely return the value of the property at the property string path.
   * If the path does not exist, {undefined} is returned or an error
   * is thrown if [enforce] is {true}.
   *
   * NOTE: If the value is {null}, {undefined} is returned (or error thrown),
   *       but if value is an empty string or empty object, the value is returned.
   *
   * @param {object} obj - The object to lookup the property on.
   * @param {string} path - The property path string, i.e. `foo.bar.baz`.
   * @param {boolean} [enforce] - If `true`, throws an error if the path is not valid for the object.
   * @returns The value at the property path if not {undefined} or {null}, otherwise {undefined}.
   */
  mod.prop = (obj, path, enforce) => {
    
    let item = obj;
    
    if (!obj) {
      if (enforce) {
        throw Error(`Path: "${path} not in object: ${obj}.`);
      } else {
        return undefined;
      }
    }
    
    let parts = path.split('.');
    for (let i = 0; i < parts.length; i++) {
      
      let part = parts[i];
      let value = item[part];
      
      // Allow empty strings/objects.
      if (value == null || typeof value === 'undefined') {
        if (enforce) {
          throw Error(`Path "${path} not in object.`);
        } else {
          return undefined;
        }
      }
      
      if (i === parts.length - 1) {
        return value;
      } else {
        item = value;
      }
    }
    
  };
  
  /**
   * Returns and array of the values in an object.
   * It only returns the objects own values, not those from the prototype chain.
   */
  mod.values = (obj) => Object.keys(obj || {}).map(key => obj[key]);
  
  /** Reverses a simple object containing key - value pairs. */
  mod.reverse = (obj, callback) => {
    callback = callback || mod.identity;
    return Object.keys(obj).reduce((prev, curr) => {
      prev[obj[curr]] = callback(curr);
      return prev
    }, {});
  };
  
  
  
  /* FUNCTION UTILS
   --------------------------------------------------------------- */
  
  /** Returns `true` only if the property on the object is a function. */
  mod.isFunc = (obj, path) => typeof mod.prop(obj, path) === 'function';
  
  
  
  /* ARRAY UTILS
   --------------------------------------------------------------- */
  
  /** Chunk an array into smaller arrays. */
  mod.chunk = (arr, chunkSize) => {
    let groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  };
  
  /**
   * Add an item or array of items in between every item in the array.
   * @param {Array} arr - The array to weave things into.
   * @param {*} o - The item to weave into the array, if `o` is an Array
   *        then the items of `o` are woven into `arr` sequentially.
   */
  mod.weave = (arr, o) => {
    return arr.reduce((prev, curr, i) => {
      prev.push(curr);
      if (i !== arr.length -1) prev.push(Array.isArray(o) ? o[i] : o);
      return prev;
    }, []);
  };
  
  
  
  /* MISC
   --------------------------------------------------------------- */
  
  /**
   * Parse the inner text contents of 'selector' as JSON.
   * @param {string} selector - The css selector to the element parse text contents of.
   */
  mod.json = (selector) => JSON.parse($(selector).text());
  
  /**
   * Converts form inputs/values into a json string.
   * @param {string} selector - The css selector to the form.
   * @returns {string} json - The resulting json string.
   */
  mod.jsonForm = (selector) => {
    
    let data = $(selector).serializeArray(),
        result = {};
    
    data.forEach(function (input) { result[input.name] = input.value; });
    
    return JSON.stringify(result);
  };
  
  /** Formatters */
  mod.format = {
    
    /** Format times as ##:##.### */
    time: (time) => `${mod.pad(time.getHours(), 2)}`
    + `:${mod.pad(time.getMinutes(), 2)}`
    + `:${mod.pad(time.getSeconds(), 2)}`
    + `.${mod.pad(time.getMilliseconds(), 3)}`,
    
    /**
     * Return a formatted percent string to the decimal places specified.
     * i.e.
     * util.format.percent(13, 205, 3) results in "6.341%"
     * util.format.percent(5, 10, 3) results in "50%"
     * @param {Number} count - The current count of items.
     * @param {Number} total - The total number of items.
     * @param {Number} decimals - The number of decimal places.
     */
    percent(count, total, decimals) {
      return Number((count / total * 100).toFixed(decimals)).toString() + '%';
    },
    
    /**
     * Return a formatted currency string for the supplied number.
     * i.e.
     * util.format.currency(123456789.12345) results in "$123,456,789.12"
     * @param {Number} n - The currency amount.
     */
    currency(n) {
      let c = 2;
      let d = '.';
      let t = ',';
      let s = n < 0 ? '-$' : '$';
      let i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '';
      let l = i.length;
      let j = l > 3 ? l % 3 : 0;
      
      return s + (j ? i.substr(0, j) + t : '') +
          i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
          (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    },
    
    /**
     * Returns a phone number string in the format "(###) ### - ####".
     * @param {string} number - Phone number to format.
     * @param {boolean} [trim] - Optionally trim off underscore place holders. Default: `true`.
     */
    phone(number, trim) {
      
      if (typeof trim === 'undefined') trim = true;
      
      let area = '___', first = '___', second = '____';
      let stripped = number.replace(/[^\d]/g, '');
      
      for (let i = 0; i < 10; i++) {
        let digit = stripped[i];
        if (typeof digit == 'undefined') break;
        
        if (i < 3) { area = util.replaceAt(area, i, digit); }
        else if (i < 6) { first = util.replaceAt(first, i - 3, digit); }
        else { second = util.replaceAt(second, i - 6, digit); }
      }
      
      let result =  `(${area}) ${first} - ${second}`;
      
      if (trim) result = result.substr(0, result.indexOf('_'));
      
      return result;
    }
    
  };
  
  /** Use performance API if it's available for better precision. */
  mod.timer = mod.isFunc(window, 'performance.now') ? window.performance : window.Date;
  
  mod.regex = {
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    geo: {
      lat: /^-?([0-8]?[0-9]|90)\.[0-9]{1,6}$/,
      long: /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}$/
    },
    
    /** @see http://www.regular-expressions.info/creditcard.html */
    cc: {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      master: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    }
  };
  
  /** General purpose validators */
  mod.validate = {
    
    /**
     * Returns true if the supplied latitude is valid, otherwise false.
     * i.e. >= -90 and <= 90, with 6 or less decimal digits
     */
    latitude: lat => {
      if (lat > 90 || lat < -90) return false;
      return mod.regex.geo.lat.test(lat);
    },
    
    /**
     * Returns true if the supplied longitude is valid, otherwise false.
     * i.e. >= -180 and <= 180, with 6 or less decimal digits
     */
    longitude: long => {
      if (long > 180 || long < -180) return false;
      return mod.regex.geo.long.test(long);
    },
    
    email: email => mod.regex.email.test(email),
    
    cc: {
      visa: number => mod.regex.cc.visa.test(number),
      master: number => mod.regex.cc.master.test(number),
      amex: number => mod.regex.cc.amex.test(number),
      diners: number => mod.regex.cc.diners.test(number),
      discover: number => mod.regex.cc.discover.test(number),
      jcb: number => mod.regex.cc.jcb.test(number),
      
      all: number => mod.regex.cc.visa.test(number) ||
                     mod.regex.cc.master.test(number) ||
                     mod.regex.cc.amex.test(number) ||
                     mod.regex.cc.diners.test(number) ||
                     mod.regex.cc.discover.test(number) ||
                     mod.regex.cc.jcb.test(number),
      
      type: number => {
        let type = null;
        Object.keys(mod.regex.cc).forEach((re) => {
          if (mod.regex.cc[re].test(number)) type = re;
        });
        return type;
      }
    }
    
  };
  
  /** Retrieve a request parameter by name. */
  mod.getParameterByName = (name) => {
    
    let regexS, regex, results;
    
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    regexS = "[\\?&]" + name + "=([^&#]*)";
    regex = new RegExp(regexS);
    results = regex.exec(window.location.href);
    
    if (results == null) {
      return null;
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
  };
  
  /**
   * Jquery (and plain old javascript) returns color values in rgb format:
   *  rgb(0, 153, 51)
   * This function will convert it to this format:
   *  #009933
   */
  mod.rgbToHex = (rgb) => {
    
    if (!rbg) return '#000000';
    
    let compositeRgb;
    let hex = x => ('0' + parseInt(x, 10).toString(16)).slice(-2);
    
    // IE8 returns color in hex
    if (rgb.match(/^#[\da-f]{6}$/)) return rgb;
    
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    compositeRgb = hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    compositeRgb = compositeRgb.toLowerCase();
    
    return '#' + compositeRgb;
  };
  
  mod.isMobile = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= 768;
  
  /**
   * Returns true is device is an ios device, false otherwise.
   * @param {Boolean} useUserAgent - If true, detection uses navigator.userAgent instead
   *                                 of navigator.platform.
   */
  mod.isIos = (useUserAgent) => {
    
    let ios = false;
    
    if (useUserAgent) {
      ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    } else {
      ios = /iPad|iPhone|iPod/.test(navigator.platform);
    }
    
    return ios;
  };
  
  /** Returns true is device is an android device, false otherwise. */
  mod.isAndroid = () => navigator.userAgent.toLowerCase().indexOf('android') > -1;
  
  /** Returns true if the devices is a mobile phone or tablet. */
  mod.isMobileDevice = () => {
    let mobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))mobile = true})(navigator.userAgent||navigator.vendor||window.opera);
    return mobile;
  };
  
  /** Store all common constants. */
  mod.const = {
    
    i18n: {},
    
    months: [
      { name: 'January', abbr: 'Jan', value: 1 },
      { name: 'February', abbr: 'Feb', value: 2 },
      { name: 'March', abbr: 'Mar', value: 3 },
      { name: 'April', abbr: 'Apr', value: 4 },
      { name: 'May', abbr: 'May', value: 5 },
      { name: 'June', abbr: 'Jun', value: 6 },
      { name: 'July', abbr: 'Jul', value: 7 },
      { name: 'August', abbr: 'Aug', value: 8 },
      { name: 'September', abbr: 'Sept', value: 9 },
      { name: 'October', abbr: 'Oct', value: 10 },
      { name: 'November', abbr: 'Nov', value: 11 },
      { name: 'December', abbr: 'Dec', value: 12 }
    ],
    
    specials: {
      'asterisk': { label: 'Asterisk', value: '*', entity: '*' },
      'reg': { label: 'Registered Trade Mark', value: '®', entity: '&reg;' },
      'tm': { label: 'Trade Mark', value: '™', entity: '&trade;' },
      'sm': { label: 'Trade Mark', value: '℠', entity: '&#8480;' },
      'dagger': { label: 'Dagger', value: '†', entity: '&dagger;' },
      'doubledagger': { label: 'Double Dagger', value: '‡', entity: '&Dagger;' },
      'section': { label: 'Section', value: '§', entity: '&sect;' }
    },
    
    timing: { scroll: 500 }
  };
  
  mod.devMode = _dev_mode;
  
  return mod;
  
})(window.jQuery);