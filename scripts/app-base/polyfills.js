/** POLYFILLS */ 

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

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
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
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

/** String.endsWith */
if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
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