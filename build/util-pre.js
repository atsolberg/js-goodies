/** 
 * Flash an element's background with a color for a duration.
 * @param {object} [options] - Options hash containing color and duration.
 * @param {number} [options.duration=1500] - The duration in milliseconds the animation will last. Default 1500.
 * @param {string} [options.color=#fff288] - The color to flash the background. Default #fff288 (yellowish).
 */
$.fn.flash = function (options) {
    return this.each(function () {
        
      let me = $(this);
      let prev = me.data('previousColor') ? me.data('previousColor') : me.css('background-color');
      
      options = $.extend({ color: '#fff288', duration: 1500 }, options || {});
      me.data('previousColor', prev);
      me.stop(true)
      .css({ backgroundColor: options.color })
      .animate({ backgroundColor: prev }, options.duration);
  });
};
/** Selects all text inside an element. Useful for copy action. */
$.fn.selectText = function () {
    
    var text = this[0], range, selection;

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
/** Set visibility to visible */
$.fn.visible = function () {
  return this.each(function () {
    $(this).css('visibility', 'visible');
  });
};

/** Set visibility to hidden */
$.fn.invisible = function () {
  return this.each(function () {
    $(this).css('visibility', 'hidden');
  });
};

/** Toggle visibility */
$.fn.visibilityToggle = function () {
  return this.each(function () {
    $(this).css('visibility', function (i, v) {
      return (v === 'visible') ? 'hidden' : 'visible';
    });
  });
};
/**
 * POLYFILLS
 * All polyfills should be pulled from https://developer.mozilla.org when possible.
 */

/** Array.from */
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };
    
    return function from(arrayLike) {
      var C = this;
      var items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }
      
      var len = toLength(items.length);
      
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
      
      var k = 0;
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }());
}

/** Array.isArray */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

/** Array.clone */
if (!Array.prototype.clone) {
  Array.prototype.clone = function () {
    return this.slice(0);
  };
}

/** Array.insert */
if (!Array.prototype.insert) {
  Array.prototype.insert = function (item, index) {
    if (index < 0) {
      throw new Error('Index must be greater than 0.');
    }
    if (index > this.length - 1) {
      throw new Error(`Index must be less than array length. Index: ${index}, Length: ${this.length}`);
    }
    return this.splice(index, 0, item);
  };
}

/** Array.move */
if (!Array.prototype.move) {
  Array.prototype.move = function(value, by) {
    'use strict';
    
    var index = this.indexOf(value),
        newPos = index - (by || 1);
    
    if (index === -1) throw new Error('Element not found in array');
    
    if (newPos < 0) newPos = 0;
    
    this.splice(index, 1);
    this.splice(newPos, 0, value);
    
  };
}

/** Array.moveAt */
if (!Array.prototype.moveAt) {
  Array.prototype.moveAt = function(index, by) {
    'use strict';
    
    var newPos = index - (by || 1);
    var value = this[index];
    
    if (index === -1) throw new Error('Element not found in array');
    
    if (newPos < 0) newPos = 0;
    
    this.splice(index, 1);
    this.splice(newPos, 0, value);
    
  };
}

/** Array.remove */
if (!Array.prototype.remove) {
  Array.prototype.remove = function(index) {
    'use strict';
    
    if (index === -1) throw new Error('Index should be a positive integer');
    return this.splice(index, 1)[0];
    
  };
}

/** Array.filter */
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';
    
    if (this === void 0 || this === null) {
      throw new TypeError();
    }
    
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }
    
    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }
    
    return res;
  };
}

/** Array.forEach */
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach(callback, thisArg) {
    'use strict';
    var T, k;
    
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    
    var kValue,
        O = Object(this),
        len = O.length >>> 0;
    
    if ({}.toString.call(callback) !== '[object Function]') {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length >= 2) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

/** Array.findIndex */
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

/** Array.find */
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/** Array.includes */
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }
    
    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
          (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}

/** Object.create */
if (!Object.create) {
  Object.create = (function () {
    function F() {};
    
    return function (o) {
      if (arguments.length != 1) {
        throw new Error('Object.create implementation only accepts one parameter.');
      }
      F.prototype = o;
      return new F();
    };
  })();
}

/** Object.assign */
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      
      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/** Function.prototype.bind */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    
    var
        aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    
    return fBound;
  };
}

/** String.startsWith */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position){
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

/** String.endsWith */
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

/** String.contains */
if (!String.prototype.contains) {
  String.prototype.contains = function () {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

/** String.trim */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
  };
}

/** CustomEvent */
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
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
util.namespace('util.hidy');

/**
 * Module to get/set section container collapsed state in a cookie.
 * @module util.hidy
 * @requires jQuery
 * @requires Cookies
 */
util.hidy = (function($, JSON, Cookies) {

  'use strict';

  let _cookie = 'util-hidy';

  // Public API of this module.
  let module = {};

  /**
   * Returns all section container's collapsed state
   * as an object with keys as the section identifier.
   * @returns {*}
   */
  module.all = () => {

    let value = Cookies.get(_cookie);
    if (!value) {
      value = JSON.stringify({});
      Cookies.set(_cookie, value);
    }

    return JSON.parse(value);
  };

  /**
   * Returns true if the section's collapsed state has ever
   * been stored before.
   * @param {string} name - The section identifier.
   * @param {string} [url] - The page this section is on. Default is `location.pathname`.
   * @returns {boolean} - `true` if section's collapsed state has ever been stored before.
   */
  module.has = (name, url) => {

    url = (url || location.pathname);

    let all = module.all(),
        key = `${url}::${name}`;

    return all.hasOwnProperty(key);
  };

  /**
   * Returns the collapsed state of the section.
   * Defaults to false if not specified.
   * @param {string} name - The section identifier.
   * @param {string} [url] - The page this section is on. Default is `location.pathname`.
   * @returns {boolean}
   */
  module.get = (name, url) => {

    url = (url || location.pathname);

    let all = module.all(),
        key = `${url}::${name}`;

    let collapsed = all[key];

    return collapsed || false;
  };

  /**
   * Sets the collapsed state of the section.
   * @param {string} name - The section identifier.
   * @param {boolean} collapsed
   * @param {string} [url] - The page this section is on. Default is `location.pathname`.
   */
  module.set = (name, collapsed, url) => {

    url = (url || location.pathname);

    let all = module.all(),
        key = `${url}::${name}`;

    all[key] = collapsed;

    Cookies.set(_cookie, all);
  };

  return module;

})(jQuery, JSON, Cookies);

util.namespace('util.hub');

/**
 * A simple pub/sub module. See http://davidwalsh.name/pubsub-javascript
 * 
 * @requires util
 */
util.hub = (function () {
    
    var topics = {};
    var hop = topics.hasOwnProperty;
    
    return {
        
        /** 
         * Subcribe a listener function to be notified of an event on a topic.
         * Returns an object with a 'remove' property as a function to remove the registered listener.
         * 
         * @param {string} topic - The topic to subscribe to.
         * @param {Function} listener - The listener function fired for each event on the topic.
         * @return {Object} o - Listener removal handler.
         */
        sub: function (topic, listener) {
            // Create the topic's object if not yet created
            if (!hop.call(topics, topic)) topics[topic] = [];
            
            // Add the listener to topic's listner queue
            var index = topics[topic].push(listener) -1;
            
            // Provide handle back for removal of a topic listener
            return {
                remove: function () {
                    delete topics[topic][index];
                }
            };
        },
        
        /**
         * Publish an event on the topic with optional data.
         * 
         * @param {string} topic - The topic to publish the event on.
         * @param {Object} [data] - The optional data to pass the listeners.
         */
        pub: function (topic, data) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!hop.call(topics, topic)) return;
            
            // Cycle through topics queue, fire!
            topics[topic].forEach(function (listener) {
                listener(data || {});
            });
        }
    };
})();
util.namespace('util.react');

/**
 * Module to house common react components and functionality.
 *
 * @module util.react
 * @requires jQuery
 * @requires classNames
 * @requires React
 * @requires ReactDOM
 * @requires ReactBootstrap
 */
util.react = (function ($, i18n, cx, R, RD, bs) {
  
  let mod = {}; // The module's public API
  
  let PNU = i18n.phonenumbers.PhoneNumberUtil.getInstance();
  let PNF = i18n.phonenumbers.PhoneNumberFormat;
  
  let {Modal, Button} = bs;
  
  let _cc = R.createClass;
  let PropTypes = R.PropTypes;
  
  let _common_text_input_props = {
    label: PropTypes.any,
    id: PropTypes.string,
    
    name: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    
    classes: PropTypes.string,
    wrapperClasses: PropTypes.string
  };
  
  
  /* COMPONENTS
   --------------------------------------------------------------- */
  
  mod.AddressFields = _cc({
    
    displayName: 'AddressFields',
    
    propTypes: {
      address: PropTypes.object.isRequired,
      property: PropTypes.string.isRequired,
      actions: PropTypes.object.isRequired,
      states: PropTypes.array.isRequired
    },
    
    render() {
      
      let {TextInput, ZipInput, PhoneInput} = mod;
      
      let prop = this.props.property;
      let {address, actions} = this.props;
      let {change, dispatch} = actions;
      let states = this.props.states.map((state) => {
        return <option key={state.isocode} value={state.isocode}>{state.name}</option>;
      });
      
      let checkEmail = mod.validators.email(`${prop}.email.error`, dispatch);
      
      return (
          <div>
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <TextInput label="First Name" name="firstName" onChange={change(`${prop}.firstName`)}
                           value={address.firstName.value} error={address.firstName.error}/>
              </div>
              <div className="col-xs-12 col-sm-6">
                <TextInput label="Last Name" name="lastName" onChange={change(`${prop}.lastName`)}
                           value={address.lastName.value} error={address.lastName.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12">
                
                <TextInput label="Address" name="streetAddress" onChange={change(`${prop}.streetAddress`)}
                           value={address.streetAddress.value} error={address.streetAddress.error}/>
                
                <TextInput label="Apt / Suite" desc="(optional)" name="aptOption" onChange={change(`${prop}.aptOption`)}
                           value={address.aptOption.value} error={address.aptOption.error}/>
                
                <TextInput label="City" name="city" onChange={change(`${prop}.city`)}
                           value={address.city.value} error={address.city.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <div className="form-group">
                  <label className="control-label">State</label>
                  <select className="form-control" onChange={change(`${prop}.state`)}
                          value={address.state.value}>{states}</select>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <ZipInput name="zip" onChange={change(`${prop}.zip`)}
                          value={address.zip.value} error={address.zip.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12">
                <TextInput type="email" label="Email" name="email"
                           onChange={change(`${prop}.email`)} onBlur={checkEmail}
                           value={address.email.value} error={address.email.error}/>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <PhoneInput name="phone" onChange={change(`${prop}.phone`)}
                            value={address.phone.value} error={address.phone.error}/>
              </div>
            </div>
          </div>
      );
    }
  });
  
  /**
   * A section container with a header and the option for a control
   * to expand the content to full width. Use the `controls` prop
   * to pass your own control components.
   */
  mod.Section = _cc({
    
    displayName: 'Section',
    
    propTypes: {
      title: PropTypes.any.isRequired,
      id: PropTypes.string,
      expandable: PropTypes.bool,
      controls: PropTypes.any
    },
    
    getInitialState() { return { wide: false }; },
    
    toggle() {
      this.setState({ wide: !this.state.wide });
    },
    
    render() {
      
      let {title, id, expandable, controls, children} = this.props,
          {wide} = this.state,
          icon = cx('fa', {
            'fa-expand': !this.state.wide,
            'fa-compress': this.state.wide
          }),
          headerProps = {};
      
      if (id) headerProps.id = id;
      
      return (
          <div>
            <div className="container">
              <h2 {...headerProps}>{title}
                <div className="dib pull-right">
                  {controls}
                  {expandable && (
                      <button type="button" className="btn btn-link" onClick={this.toggle}>
                        <i className={icon}/>
                      </button>
                  )}
                </div>
              </h2>
              <hr className="rule-xs"/>
            </div>
            <div className={cx({ container: !expandable || !wide })}>
              {children}
            </div>
          </div>
      );
    }
    
  });
  
  /**
   * A component that renders a bootstrap form group with a text input.
   * Supports error/validation visualization.
   */
  mod.TextInput = _cc({
    
    displayName: 'TextInput',
    
    propTypes: Object.assign({}, _common_text_input_props, {
      pattern: PropTypes.string,
      autoFocus: PropTypes.string,
      maxLength: PropTypes.string,
      desc: PropTypes.string
    }),
    
    getDefaultProps() {
      return { type: 'text' };
    },
    
    render() {
      
      let {label, classes, wrapperClasses, desc, id, placeholder, autoFocus, pattern, maxLength} = this.props;
      let {type, name, value, onChange, onBlur, onFocus, onKeyUp, error} = this.props;
      let msg = <div className="text-danger" style={{ marginTop: '5px' }}>{error}</div>;
      let inputProps = { onChange, value, ref: 'input' };
      let labelProps = {};
      
      if (id) {
        inputProps.id = id;
        labelProps.htmlFor = id;
      }
      if (name) inputProps.name = name;
      if (onBlur) inputProps.onBlur = onBlur;
      if (onFocus) inputProps.onFocus = onFocus;
      if (onKeyUp) inputProps.onKeyUp = onKeyUp;
      if (placeholder) inputProps.placeholder = placeholder;
      if (pattern) inputProps.pattern = pattern;
      if (maxLength) inputProps.maxLength = maxLength;
      if (autoFocus) inputProps.autoFocus = autoFocus;
      
      return (
          <div className={cx('form-group', { 'has-error' : error }, wrapperClasses)}>
            {label && (<label className="control-label" {...labelProps}>{label}</label>)}
            {desc && (<span className="control-desc"> {desc}</span>)}
            <input type={type} className={cx('form-control', classes)} {...inputProps}
                   onChange={onChange} value={value}/>
            {error && msg}
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap form group with a zip code number input.
   * Supports error/validation visualization.
   */
  mod.ZipInput = _cc({
    
    displayName: 'ZipInput',
    
    propTypes: _common_text_input_props,
    
    render() {
      
      let {label, id, classes, wrapperClasses, placeholder, autoFocus} = this.props;
      let {name, value, onChange, onBlur, onKeyUp, error} = this.props;
      let msg = <div className="text-danger" style={{ marginTop: '5px' }}>{error}</div>;
      let inputProps = { onChange, value, ref: 'input' };
      let labelProps = {};
      
      if (id) {
        inputProps.id = id;
        labelProps.htmlFor = id;
      }
      if (name) inputProps.name = name;
      if (onKeyUp) inputProps.onKeyUp = onKeyUp;
      if (onBlur) inputProps.onBlur = onBlur;
      if (placeholder) inputProps.placeholder = placeholder;
      if (autoFocus) inputProps.autoFocus = autoFocus;
      
      label = label || 'Zip';
      
      return (
          <div className={cx('form-group', { 'has-error' : error }, wrapperClasses)}>
            <label className="control-label" {...labelProps}>{label}</label>
            <input type="text" className={cx('form-control', classes)} {...inputProps}/>
            {error && msg}
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap form group with a phone number input.
   * Supports error/validation visualization.
   */
  mod.PhoneInput = _cc({
    
    displayName: 'PhoneInput',
    
    propTypes: _common_text_input_props,
    
    change(e) {
      
      let {phone} = this.refs;
      try {
        let formatted = PNU.format(PNU.parse(phone.value, 'US'), PNF.NATIONAL);
        phone.value = formatted || '';
      } catch (error) {/* Ignore errors as they type. */}
      
      this.props.onChange(e);
    },
    
    render() {
      
      let {label, id, classes, wrapperClasses, name, value, error, placeholder, autoFocus} = this.props;
      let msg = <div className="text-danger" style={{ marginTop: '5px' }}>{error}</div>;
      let inputProps = { onChange: this.change, value };
      let labelProps = {};
      
      if (id) {
        inputProps.id = id;
        labelProps.htmlFor = id;
      }
      if (name) inputProps.name = name;
      if (autoFocus) inputProps.autoFocus = autoFocus;
      
      label = label || 'Phone';
      
      inputProps.placeholder = placeholder || '';
      
      return (
          <div className={cx('form-group', { 'has-error' : error }, wrapperClasses)}>
            <label className="control-label" {...labelProps}>{label}</label>
            <input ref="phone" type="tel" className={cx('form-control', classes)} {...inputProps}/>
            {error && msg}
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap two button toggle driven by
   * two radio button inputs.
   */
  mod.ToggleInput = _cc({
    
    displayName: 'ToggleInput',
    
    propTypes: {
      label: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      name: PropTypes.string
    },
    
    render() {
      
      let {label, name, value, onChange} = this.props;
      let inputProps = {onChange};
      
      if (name) inputProps.name = name;
      
      return (
          <div className="form-group">
            <label className="control-label">{label}</label>
            <div className="btn-group db clearfix">
              <label className={'btn btn-default' + (value == true  ? ' active' : '')}>
                <input type="radio" value={true} checked={value == true} {...inputProps}/>
                <span className={value == true ? 'text-success' : ''}>Yes</span>
              </label>
              <label className={'btn btn-default' + (value != true  ? ' active' : '')}>
                <input type="radio" value={false} checked={value != true} {...inputProps}/>
                <span className={value != true ? 'text-danger' : ''}>No</span>
              </label>
            </div>
          </div>
      );
      
    }
    
  });
  
  /**
   * A component that renders a bootstrap looking range input.
   */
  mod.RangeInput = _cc({
    
    displayName: 'RangeInput',
    
    propTypes: {
      id: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      onChange: PropTypes.func,
      decorator: PropTypes.any,
      bsStyle: PropTypes.string,
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      step: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    
    getDefaultProps() {
      return {
        decorator: '%',
        bsStyle: 'primary',
        min: 0,
        max: 100,
        step: 10
      };
    },
    
    render() {
      
      let {id, name, value, onChange, decorator, bsStyle, min, max, step} = this.props,
          inputProps = {};
      
      if (id) inputProps.id = id;
      if (name) inputProps.name = name;
      inputProps.value = value;
      if (onChange) {
        inputProps.onChange = onChange;
        inputProps.onMouseMove = onChange;
      }
      
      return (
          <div className={`range range-${bsStyle}`}>
            <input className="form-control" type="range"
                   min={min} max={max} step={step} value={value} {...inputProps}/>
            <output>{value}{decorator}</output>
          </div>
      );
      
    }
    
  });
  
  /**
   * Produces a table header with sorting indicator.
   * An action is fired on header click.
   * The action type will be `sort` or `<table>.sort` if the
   * `table` prop was provided. `table` prop should be provided when
   * multiple sorting tables are used.
   */
  mod.SortingHeader = _cc({
    
    displayName: 'SortingHeader',
    
    propTypes: {
      label: PropTypes.string.isRequired,
      property: PropTypes.string.isRequired,
      sorting: PropTypes.object.isRequired,
      events: PropTypes.object,
      actions: PropTypes.object,
      table: PropTypes.string
    },
    
    sort() {
      
      let {events, actions, table, property, sorting} = this.props,
          dir = sorting.dir;
      
      if (sorting.by === property) {
        dir = (sorting.dir === 'asc' ? 'desc' : 'asc');
      }
      
      if (actions) {
        // Newer redux style apps
        actions.dispatch({
          type: (table ? table + '.' : '') + 'sort',
          sorting: { by: property, dir: dir }
        });
      } else {
        // Older event based apps
        $(events).trigger(events.NEW, {
          option: (table ? table + '.' : '') + 'sort',
          sorting: { by: property, dir: dir }
        });
      }
    },
    
    render() {
      
      let {label, property, sorting} = this.props,
          classes = ['sorting-header'],
          sorterClasses = ['fa'],
          sorter;
      
      if (sorting.by === property) classes.push('sorting-header--active');
      sorterClasses.push('fa-angle-' + (sorting.dir === 'asc' ? 'up' : 'down'));
      sorter = (<i className={sorterClasses.join(' ')}/>);
      
      return <th className={classes.join(' ')} onClick={this.sort}>{sorter} {label}</th>;
    }
    
  });
  
  /**
   * Iframe component for react. Slightly modified to do some resizing.
   * @see https://github.com/ryanseddon/react-frame-component
   */
  mod.Frame = R.createClass({
    
    displayName: 'Frame',
    
    // React warns when you render directly into the body since browser extensions
    // also inject into the body and can mess up React. For this reason
    // initialContent is expected to have a div inside of the body
    // element that we render react into.
    propTypes: {
      style: PropTypes.object,
      head:  PropTypes.node,
      initialContent:  PropTypes.string
    },
    
    getDefaultProps() {
      return {
        initialContent: '<!DOCTYPE html><html><head></head><body><div></div></body></html>'
      };
    },
    
    originalError: console.error,
    
    // Rendering a <head> into a body is technically invalid although it
    // works. We swallow React's validateDOMNesting warning if that is the
    // message to avoid confusion.
    swallowInvalidHeadWarning() {
      console.error = (msg) => {
        if (/<head>/.test(msg)) return;
        this.originalError.call(console, msg);
      };
    },
    
    resetWarnings() {
      console.error = this.originalError;
    },
    
    render() {
      // The iframe isn't ready so we drop children from props here. #12, #17
      return R.createElement('iframe', Object.assign({}, this.props, {children: undefined}));
    },
    
    componentDidMount() {
      this._isMounted = true;
      this.renderFrameContents();
      setTimeout(() => {
        let frame = RD.findDOMNode(this);
        frame.height = (frame.contentWindow.document.body.scrollHeight + 'px');
      }, 100);
    },
    
    renderFrameContents() {
      if (!this._isMounted) {
        return;
      }
      
      var doc = RD.findDOMNode(this).contentDocument;
      if(doc && doc.readyState === 'complete') {
        var contents = R.createElement('div',
            undefined,
            this.props.head,
            this.props.children
        );
        
        if (!this._setInitialContent) {
          doc.clear();
          doc.open();
          doc.write(this.props.initialContent);
          doc.close();
          this._setInitialContent = true;
        }
        
        this.swallowInvalidHeadWarning();
        // unstable_renderSubtreeIntoContainer allows us to pass this component as
        // the parent, which exposes context to any child components.
        RD.unstable_renderSubtreeIntoContainer(this, contents, doc.body.children[0]);
        this.resetWarnings();
      } else {
        setTimeout(this.renderFrameContents, 0);
      }
    },
    
    componentDidUpdate() {
      this.renderFrameContents();
      setTimeout(() => {
        let frame = RD.findDOMNode(this);
        frame.height = (frame.contentWindow.document.body.scrollHeight + 'px');
      }, 100);
    },
    
    componentWillUnmount() {
      this._isMounted = false;
      
      var doc = RD.findDOMNode(this).contentDocument;
      if (doc) {
        RD.unmountComponentAtNode(doc.body);
      }
    }
  });
  
  /**
   * A generic confirmation modal.
   */
  mod.Confirm = _cc({
    
    displayName: 'Confirm',
    
    propTypes: {
      confirmAction: PropTypes.func.isRequired,
      cancelAction: PropTypes.func.isRequired,
      showing: PropTypes.bool.isRequired,
      classes: PropTypes.string,
      title: PropTypes.string,
      message: PropTypes.any,
      confirmBtnText: PropTypes.string,
      cancelBtnText: PropTypes.string
    },
    
    render() {
      
      let {confirmAction, cancelAction} = this.props;
      let {showing, classes, title, message} = this.props;
      let {confirmBtnText, cancelBtnText} = this.props;
      
      classes = (classes || 'theme-default');
      title = (title || 'Confirm');
      message = (message || 'Are you sure');
      confirmBtnText = (confirmBtnText || 'OK');
      cancelBtnText = (cancelBtnText || 'CANCEL');
      
      return (
          <Modal className={classes} show={showing} onHide={cancelAction}>
            <Modal.Header closeButton={true}>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="padded">{message}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={cancelAction} className="btn-link">{cancelBtnText}</Button>
              <Button onClick={confirmAction} bsStyle="primary">{confirmBtnText}</Button>
            </Modal.Footer>
          </Modal>
      );
    }
    
  });
  
  mod.icons = {
    loaders: {
      Circle1: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
                <path opacity="0.2" fill="#000"
                      d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                       s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                       c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
                <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                                   C22.32,8.481,24.301,9.057,26.013,10.047z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
        );
      },
      
      Circle2: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 50 50" enable-background="new 0 0 50 50">
                <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
        );
      },
      
      Circle3: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 50 50" enable-background="new 0 0 50 50">
                <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
        );
      },
      
      Bars1: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 24" enable-background="new 0 0 50 50">
                <rect x="0" y="0" width="4" height="7" fill="#333">
                  <animateTransform  attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="0" width="4" height="7" fill="#333">
                  <animateTransform  attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="0" width="4" height="7" fill="#333">
                  <animateTransform  attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars2: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="0" width="4" height="10" fill="#333">
                  <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars3: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="13" width="4" height="5" fill="#333">
                  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite"/>
                  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="13" width="4" height="5" fill="#333">
                  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite"/>
                  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
                <rect x="20" y="13" width="4" height="5" fill="#333">
                  <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite"/>
                  <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars4: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="7" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="14" y="0" width="4" height="20" fill="#333">
                  <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
        );
      },
      
      Bars5: (props) => {
        return (
            <div className={cx('svg-loader', props.classes)}>
              <svg x="0" y="0" viewBox="0 0 24 30" enable-background="new 0 0 50 50">
                <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
                  <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
        );
      }
    }
  };
  
  
  
  /* METHODS
   --------------------------------------------------------------- */
  
  mod.text = {
    
    /**
     * Weave <br>'s in between each string in an array of strings.
     * Each string in the original array is wrapped in a span to apply a key.
     * @param {String[]} text - The array of strings to weave <br>'s into.
     */
    'break': (text) => {
      return text.reduce((prev, curr, i) => {
        prev.push(<span key={`t-${i}`}>{curr}</span>);
        if (i < text.length -1) prev.push(<br key={`b-${i}`}/>);
        return prev;
      }, []);
    }
    
  };
  
  mod.validators = {
    
    /**
     * Returns a dom event handler (usually for `onBlur`)
     * that dispatches an action if the value is not a valid email.
     * @param {string} type - The action type.
     * @param {function} dispatch - The store dispatcher.
     * @param {string} [msg] - The Error message.
     * @returns {function} - The dom event handler.
     */
    email: (type, dispatch, msg) => {
      return (e) => {
        let {value} = e.target;
        msg = msg || 'Please enter a valid email address.';
        if (!util.validate.email(value)) dispatch({type, value: msg});
      };
    },
    
    /**
     * Returns a dom event handler that dispatches an action value is empty.
     * @param {string} type - The action type.
     * @param {function} dispatch - The store dispatcher.
     * @param {string} [msg] - The Error message.
     * @returns {function} - The dom event handler.
     */
    required: (type, dispatch, msg) => {
      return (e) => {
        let {value} = e.target;
        msg = msg || 'Required';
        if (!value || !value.trim()) dispatch({type, value: msg});
      };
    }
    
  };
  
  return mod;
  
})(jQuery, i18n, classNames, React, ReactDOM, ReactBootstrap);
util.namespace('util.storage');

/**
 * Module to store data as json in local storage.
 * Data is storage as stringified json since local storage
 * only supports string values.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 * @module util.storage
 */
util.storage = (() => {
  
  'use strict';
  
  let mod = {};
  
  let _name = 'ats';
  
  /**
   * Retrieve value stored in local storage.
   * @param {string} key - The key to lookup the value, will be prefixed with 'sn-'.
   * @param {string} defaultValue - Returned if the key is not found.
   */
  mod.get = (key, defaultValue) => {
    let value = JSON.parse(localStorage[`${_name}-${key}`] || null);
    return value || defaultValue;
  };
  
  /**
   * Sets a value in local storage.
   * @param {string} key - The key to store the value at, will be prefixed with 'sn-'.
   * @param {string} value - Value to store.
   */
  mod.set = (key, value) => {
    try {
      localStorage[`${_name}-${key}`] = JSON.stringify(value);
    } catch (e) {
      util.error(`localStorage set failed`, `key: ${key}`, `value:`, value);
    }
  };
  
  mod.getName = () => _name;
  
  return mod;
  
})();
util.namespace('util.store');

/**
 * Module to create data stores.
 * @module util.store
 * @requires util.stores
 */
util.store = (($) => {
  
  let module = {};
  
  let _css = {
    bold: 'font-weight: bold;',
    normal: 'font-weight: normal;',
    gray: 'color: #9E9E9E;',
    blue: 'color: #03A9F4;',
    green: 'color: #4CAF50;',
    red: 'color: #F20404;'
  };
  
  let _styles = {
    value: `${_css.normal}${_css.blue}`,
    label: `${_css.bold}${_css.gray}`
  };
  
  /**
   * Create a 'ghetto redux wannabe' store.
   * @param {string} name - The name of the store handler this store uses, must exist in `util.stores`.
   * @param {object} [initial] - Initial state value.
   * @returns {object} - The store.
   */
  module.create = (name, initial) => {
    
    let state;
    let logging = util.devMode;
    let listeners = [];
    let handler = util.stores[name];
    
    state = $.extend(true, {}, handler.getDefaultState(), (initial || {}));
    
    /** Retrieve the current state of the store. */
    const getState = () => state;
    
    /** Toggle the logging of state before and after changes. */
    const toggleLogging = () => logging = !logging;
    
    /**
     * Dispatch an action or actions to the action handler,
     * then notify all store listeners.
     * @param {object|object[]} action - The action or array of actions to dispatch.
     */
    const dispatch = (action) => {
      
      let before, after;
      let multi = Array.isArray(action);
      if (logging) before = $.extend(true, {}, state);
      
      if (multi) {
        if (!action.length) return;
        action.forEach(a => { state = handler.handle(state, a); });
      } else {
        state = handler.handle(state, action);
      }
      
      if (logging) {
        
        after = $.extend(true, {}, state);
        let time = util.format.time(new Date());
        let grouper = console.groupCollapsed || console.info;
        let type = multi ? action.map(a => a.type).join(', ') : action.type;
        
        grouper.apply(console, [
          `${time} %cstore: %c${name} %caction${multi ? 's' : ''}: %c${type}`,
          `${_styles.label}`, `${_styles.value}`, `${_styles.label}`, `${_styles.value}`
        ]);
        console.info('%cBefore', `${_css.gray}`, before);
        console.info(`%cAction${multi ? 's' : ''}`, `${_css.blue}`, action);
        console.info('%cAfter', `${_css.green}`, after);
        if (console.groupEnd) console.groupEnd();
      }
      
      listeners.forEach(listener => listener());
    };
    
    /**
     * Returns an event handler function to dispatch actions with a `type` and `value` property.
     * If the first argument is an event, the `value` is pulled from the  event's current target,
     * otherwise the first argument is used as the `value`.
     *
     * Any additional arguments are also included in the action.
     * Useful for creating `onClick` or `onChange` handlers.
     *
     * @param {string} type - The action type.
     * @returns {function()} - The dom event callback.
     */
    const change = function (type) {
      
      let args = [].slice.apply(arguments);
      
      return arg => {
        
        let value = (typeof arg === 'object' && arg.currentTarget ? arg.currentTarget.value : arg);
        let action = {type, value};
        
        if (args.length > 1) {
          let remaining = args.slice(1);
          action = Object.assign(action, { params: remaining });
        }
        
        dispatch(action);
      }
    };
    
    /**
     * Helper method that returns a dom callback just like #change
     * but for react bootstraps' `onSelect` handlers.
     * @param {string} type - The action type.
     * @returns {function(e, value)} - The dom event callback.
     */
    const select = function (type) {
      
      let args = [].slice.apply(arguments);
      
      return (e, value) => {
        
        let action = {type, value};
        if (args.length > 1) action = Object.assign(action, { params: args.slice(1) });
        
        dispatch(action);
      }
    };
    
    /**
     * Register a listener callback to the store.
     * Listeners callbacks are fired after actions are dispatched in the
     * order they were registered.
     * @param {function} listener - The listener callback to register.
     * @returns {function} - A function to unregister the listener.
     */
    const subscribe = (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    };
    
    dispatch({});
    
    let store = {
      name,
      getState,
      subscribe,
      dispatch, change, select,
      toggleLogging
    };
    
    // Add optional store functionality.
    if (util.isFunc(handler, 'getData')) store.getData = handler.getData;
    if (util.prop(handler, 'utils')) store.utils = handler.utils;
    
    return store;
  };
  
  return module;
  
})(jQuery);
util.namespace('util.stores.modal');

/**
 * Example store - supporting some theortic modal.
 * @module util.stores.modal
 * @requires jQuery
 */
util.stores.modal = ($ => {

  let _default_state = {
    title: '',
    showing: false
  };

  return {

    /**
     * Store handler to execute store actions.
     * @param {object} state - The store state.
     * @param {object} action - The action to execute.
     * @param {string} action.type - The type of action to execute.
     * @return {object} state - The new state object.
     */
    handle(state = _default_state, action) {

      // Clone state for ghetto immutability.
      state = $.extend(true, {}, state);

      switch (action.type) {

        case 'open':
          state.showing = true;
          break;

        case 'close':
          state.showing = false;
          break;

        case 'title':
          state.title = action.value;
          break;

      }

      return state;
    },

    getDefaultState() {
      return _default_state;
    }
  }
})(window.jQuery);

util.namespace('util.suppy');

/**
 * Module to <sup> special characters.
 * @mod util.suppy
 * @requires jQuery
 */
util.suppy = ($ => {

  'use strict';

  let mod = {};

  let _marker = '.js-sup';
  let {specials} = util.const;
  let _chars = Object.keys(specials).map(k => specials[k].value).join('');

  mod.regex = new RegExp(`([${_chars}])`, 'g');

  /**
   * Wrap some characters in <sup> tags.
   * @param {string} text - The text to process.
   * @return {string} result - The resulting text with special chars <sup>'d.
   */
  mod.replace = (text) => text.replace(mod.regex, '<sup>$1</sup>');

  /**
   * Gets the inner text of the targeted element and adds a surrounding
   * <sup> tag to any special characters we normally want <sup>'d,
   * then puts it back as the inner html.
   * @param {string | Element} elem - CSS selector or DOM element to <sup>.
   */
  mod.sup = (elem) => {
    elem = $(elem);
    let text = elem.text();
    text = mod.replace(text);
    elem.html(text);
  };

  mod.all = () => {
    // Sup all suppable nodes.
    let suppable = $(_marker);
    suppable.each((idx, elem) => { mod.sup(elem); });
  };

  mod.init = () => {
    mod.all();
  };

  return mod;

})(jQuery);

// Initialize on dom ready.
$(() => { util.suppy.init(); });

util.namespace('util.ui');

/**
 * Module to house common ui behavior for the site.
 * @module util.ui
 * @requires jQuery
 */
util.ui = (function($) {
  
  'use strict';
  
  // Public API of this module.
  let module = {};
  
  /** Scroll a container to an element. */
  module.scrollTo = function (target /*, container */) {
    
    target = $(target);
    let container = $(arguments[1] || 'html, body');
    let to = target.offset().top - container.offset().top + container.scrollTop();
    
    container.animate({ scrollTop: to }, util.const.timing.scroll);
  };
  
  /** Hookup some common event handlers for all pages. */
  module.autowire = function () {
    
    /** Follow the [data-href] value on clicks of elements with this attribute. */
    $(document).on('click', '[data-href]', function (e) {
      e.preventDefault();
      window.location.href = $(this).data('href');
      return false;
    });
    
    /** Scroll To - Handle clicks on [data-scroll-to] elements. */
    $(document).on('click', '[data-scroll-to]', function () {
      
      let trigger = $(this);
      let target = $(trigger.data('scrollTo'));
      let container = $(trigger.data('scrollToContainer'));
      
      module.scrollTo(target, container);
    });
    
    /**
     * Simple Toggle List - Hide/show list items of '.js-toggle-list' list.
     * Listen only on '.js-toggle' elements to allow for other clickable elements
     * inside the list items.
     */
    $(document).on('click touch', '.js-toggle-list .js-toggle', function () {
      
      let toggle = $(this);
      let item = toggle.closest('.js-toggle-item');
      if (!item.length) item = toggle.closest('li');
      
      item.toggleClass('collapsed');
    });
    
  };
  
  return module;
  
})(window.jQuery);

$(function () { util.ui.autowire(); });