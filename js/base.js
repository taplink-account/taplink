function setEventWrapper(t) {
	var tmp = t.addEventListener;
	t.addEventListener = function(on, fn, options) {
		var self = this;
		var fired = false;
		var cb = fn;
		
		if (['DOMContentLoaded', 'load'].indexOf(on) != -1) {
			fn = function(e) {
				if (fired) return;
				cb.call(self, e);
				fired = true;
			}
		}
		
		return tmp.call(self, on, fn, options);
	}
}

setEventWrapper(window);
setEventWrapper(document);

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
;(function() {
    // helpers
    var regExp = function(name) {
        return new RegExp('(^| )'+ name +'( |$)');
    };
    var forEach = function(list, fn, scope) {
        for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
        }
    };

    // class list object with basic methods
    function ClassList(element) {
        this.element = element;
    }

    ClassList.prototype = {
        add: function() {
            forEach(arguments, function(name) {
                if (!this.contains(name)) {
                    this.element.className += ' '+ name;
                }
            }, this);
        },
        remove: function() {
            forEach(arguments, function(name) {
                this.element.className =
                    this.element.className.replace(regExp(name), '');
            }, this);
        },
        toggle: function(name, state) {
            return ((state == undefined && this.contains(name)) || state)
                ? (this.remove(name), false) : (this.add(name), true);
        },
        contains: function(name) {
            return regExp(name).test(this.element.className);
        }
        // bonus..
/*
        replace: function(oldName, newName) {
            this.remove(oldName), this.add(newName);
        }
*/
    };

    // IE8/9, Safari
    if (!('classList' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                return new ClassList(this);
            }
        });
    }

    // replace() support for others
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
        DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
})();
if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  };
}
(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = name.toString();
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = value.toString();
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    var self = this
    if (headers instanceof Headers) {
      headers.forEach(function(name, values) {
        values.forEach(function(value) {
          self.append(name, value)
        })
      })

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        self.append(name, headers[name])
      })
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  // Instead of iterable for now.
  Headers.prototype.forEach = function(callback) {
    var self = this
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      callback(name, self.map[name])
    })
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return fetch.Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new fetch.Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return fetch.Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return fetch.Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return fetch.Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : fetch.Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(function (text) {
          return JSON.parse(text);
      });
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(url, options) {
    options = options || {}
    this.url = url

    this.credentials = options.credentials || 'omit'
    this.headers = new Headers(options.headers)
    this.method = normalizeMethod(options.method || 'GET')
    this.mode = options.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(options.body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  function getXhr() {
    // from backbone.js 1.1.2
    // https://github.com/jashkenas/backbone/blob/1.1.2/backbone.js#L1181
    if (noXhrPatch && !(/^(get|post|head|put|delete|options)$/i.test(this.method))) {
      this.usingActiveXhr = true;
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return new XMLHttpRequest();
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    // TODO: Request constructor should accept input, init
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new fetch.Promise(function(resolve, reject) {
      var xhr = getXhr();
      if (request.credentials === 'cors') {
        xhr.withCredentials = true;
      }

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      function onload() {
        if (xhr.readyState !== 4) {
          return
        }
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }
      xhr.onreadystatechange = onload;
      if (!self.usingActiveXhr) {
        xhr.onload = onload;
        xhr.onerror = function() {
          reject(new TypeError('Network request failed'))
        }
      }

      xhr.open(request.method, request.url, true)

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(name, values) {
        values.forEach(function(value) {
          xhr.setRequestHeader(name, value)
        })
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  fetch.Promise = self.Promise; // you could change it to your favorite alternative
  self.fetch.polyfill = true
})();
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
(function(global){

//
// Check for native Promise and it has correct interface
//

var NativePromise = global['Promise'];
var nativePromiseSupported =
  NativePromise &&
  // Some of these methods are missing from
  // Firefox/Chrome experimental implementations
  'resolve' in NativePromise &&
  'reject' in NativePromise &&
  'all' in NativePromise &&
  'race' in NativePromise &&
  // Older version of the spec had a resolver object
  // as the arg rather than a function
  (function(){
    var resolve;
    new NativePromise(function(r){ resolve = r; });
    return typeof resolve === 'function';
  })();


//
// export if necessary
//

if (typeof exports !== 'undefined' && exports)
{
  // node.js
  exports.Promise = nativePromiseSupported ? NativePromise : Promise;
  exports.Polyfill = Promise;
}
else
{
  // AMD
  if (typeof define == 'function' && define.amd)
  {
    define(function(){
      return nativePromiseSupported ? NativePromise : Promise;
    });
  }
  else
  {
    // in browser add to global
    if (!nativePromiseSupported)
      global['Promise'] = Promise;
  }
}


//
// Polyfill
//

var PENDING = 'pending';
var SEALED = 'sealed';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';
var NOOP = function(){};

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

// async calls
var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
var asyncQueue = [];
var asyncTimer;

function asyncFlush(){
  // run promise callbacks
  for (var i = 0; i < asyncQueue.length; i++)
    asyncQueue[i][0](asyncQueue[i][1]);

  // reset async asyncQueue
  asyncQueue = [];
  asyncTimer = false;
}

function asyncCall(callback, arg){
  asyncQueue.push([callback, arg]);

  if (!asyncTimer)
  {
    asyncTimer = true;
    asyncSetTimer(asyncFlush, 0);
  }
}


function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch(e) {
    rejectPromise(e);
  }
}

function invokeCallback(subscriber){
  var owner = subscriber.owner;
  var settled = owner.state_;
  var value = owner.data_;  
  var callback = subscriber[settled];
  var promise = subscriber.then;

  if (typeof callback === 'function')
  {
    settled = FULFILLED;
    try {
      value = callback(value);
    } catch(e) {
      reject(promise, e);
    }
  }

  if (!handleThenable(promise, value))
  {
    if (settled === FULFILLED)
      resolve(promise, value);

    if (settled === REJECTED)
      reject(promise, value);
  }
}

function handleThenable(promise, value) {
  var resolved;

  try {
    if (promise === value)
      throw new TypeError('A promises callback cannot return that same promise.');

    if (value && (typeof value === 'function' || typeof value === 'object'))
    {
      var then = value.then;  // then should be retrived only once

      if (typeof then === 'function')
      {
        then.call(value, function(val){
          if (!resolved)
          {
            resolved = true;

            if (value !== val)
              resolve(promise, val);
            else
              fulfill(promise, val);
          }
        }, function(reason){
          if (!resolved)
          {
            resolved = true;

            reject(promise, reason);
          }
        });

        return true;
      }
    }
  } catch (e) {
    if (!resolved)
      reject(promise, e);

    return true;
  }

  return false;
}

function resolve(promise, value){
  if (promise === value || !handleThenable(promise, value))
    fulfill(promise, value);
}

function fulfill(promise, value){
  if (promise.state_ === PENDING)
  {
    promise.state_ = SEALED;
    promise.data_ = value;

    asyncCall(publishFulfillment, promise);
  }
}

function reject(promise, reason){
  if (promise.state_ === PENDING)
  {
    promise.state_ = SEALED;
    promise.data_ = reason;

    asyncCall(publishRejection, promise);
  }
}

function publish(promise) {
  var callbacks = promise.then_;
  promise.then_ = undefined;

  for (var i = 0; i < callbacks.length; i++) {
    invokeCallback(callbacks[i]);
  }
}

function publishFulfillment(promise){
  promise.state_ = FULFILLED;
  publish(promise);
}

function publishRejection(promise){
  promise.state_ = REJECTED;
  publish(promise);
}

/**
* @class
*/
function Promise(resolver){
  if (typeof resolver !== 'function')
    throw new TypeError('Promise constructor takes a function argument');

  if (this instanceof Promise === false)
    throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

  this.then_ = [];

  invokeResolver(resolver, this);
}

Promise.prototype = {
  constructor: Promise,

  state_: PENDING,
  then_: null,
  data_: undefined,

  then: function(onFulfillment, onRejection){
    var subscriber = {
      owner: this,
      then: new this.constructor(NOOP),
      fulfilled: onFulfillment,
      rejected: onRejection
    };

    if (this.state_ === FULFILLED || this.state_ === REJECTED)
    {
      // already resolved, call callback async
      asyncCall(invokeCallback, subscriber);
    }
    else
    {
      // subscribe
      this.then_.push(subscriber);
    }

    return subscriber.then;
  },

  'catch': function(onRejection) {
    return this.then(null, onRejection);
  }
};

Promise.all = function(promises){
  var Class = this;

  if (!isArray(promises))
    throw new TypeError('You must pass an array to Promise.all().');

  return new Class(function(resolve, reject){
    var results = [];
    var remaining = 0;

    function resolver(index){
      remaining++;
      return function(value){
        results[index] = value;
        if (!--remaining)
          resolve(results);
      };
    }

    for (var i = 0, promise; i < promises.length; i++)
    {
      promise = promises[i];

      if (promise && typeof promise.then === 'function')
        promise.then(resolver(i), reject);
      else
        results[i] = promise;
    }

    if (!remaining)
      resolve(results);
  });
};

Promise.race = function(promises){
  var Class = this;

  if (!isArray(promises))
    throw new TypeError('You must pass an array to Promise.race().');

  return new Class(function(resolve, reject) {
    for (var i = 0, promise; i < promises.length; i++)
    {
      promise = promises[i];

      if (promise && typeof promise.then === 'function')
        promise.then(resolve, reject);
      else
        resolve(promise);
    }
  });
};

Promise.resolve = function(value){
  var Class = this;

  if (value && typeof value === 'object' && value.constructor === Class)
    return value;

  return new Class(function(resolve){
    resolve(value);
  });
};

Promise.reject = function(reason){
  var Class = this;

  return new Class(function(resolve, reject){
    reject(reason);
  });
};

})(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : this);
(function() { 'use strict';

let _ = {
	_checkIteratee(iteratee) {
		if (typeof iteratee != 'function') {
			let k = iteratee;
			iteratee = function(o) { return o[k]; }
		}
		
		return iteratee;
	},
	
	debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},
	
	map(list, iteratee) {
		iteratee = this._checkIteratee(iteratee);
		
		let tmp = [];
		for(var i in list) if (list.hasOwnProperty(i)) tmp.push(iteratee(list[i], i));
		return tmp;
	},
	
	each(list, cb) {
		for(var i in list) if (list.hasOwnProperty(i)) cb(list[i], i);
	},
	
	size(list) {
		return Object.keys(list).length;
	},
	
	isNumber(n) {
		return this.isFloat(n) || this.isInteger(n);
	},

	isFloat(n) {
		return (n != null && n != undefined) && (parseFloat(n).toString() == n.toString());
	},

	isInteger(n) {
		return (n != null && n != undefined) && (parseInt(n).toString() == n.toString());
	},

	isObject(n) {
		return (n && typeof n === 'object' && !Array.isArray(n));
	},
	
	isPlainObject(n) {
		let funcToString = Function.prototype.toString;
		var objectCtorString = funcToString.call(Object);
		
		let proto = Object.getPrototypeOf(n);
		if (proto === null) return true;
		let Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
		return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
	},
	
	flatten(array, deep = false) {
      let result = [];
      this.each(array, v => {
	      if (Array.isArray(v)) {
		      result = this.concat(result, deep?this.flatten(v, deep):v);
	      } else {
		      result.push(v);
	      }
      })
      
      return result;
    },	
	
	has(o, key) {
		return o != null && hasOwnProperty.call(o, key);
	},
	
	clone(o) {
		return JSON.parse(JSON.stringify(o));
	},
	
	uniq(o) {
		return o.filter((v, i, a) => a.indexOf(v) === i); 
	},
	
	concat() {
		if (!arguments.length) return undefined;
		
		let r = arguments[0];
		for (let i = 1; i < arguments.length; i++) r = r.concat(arguments[i]);
		return r;
	},
	
	intersect(a, b) {
		return Object.keys(a).filter(x => b.hasOwnProperty(x));
// 		return a.filter(x => b.includes(x));
	},
	
	compact(list) {
		var index = -1,
			length = list == null ? 0 : list.length,
			resIndex = 0,
			result = [];
		
		while (++index < length) {
			var value = list[index];
			if (value) result[resIndex++] = value;
		}
		return result;
	},
	
	pick(object, paths) {
		return this.pickBy(object, (v, k) => {
        	return paths.indexOf(k) != -1;
      	});
	},
	
	pickBy(object, predicate) {
		if (object == null) return {};
		let result = {};
		
		this.each(object, (v, k) => {
			if (predicate(v, k)) result[k] = v;
		});
		
		return result;
	},
	
	identity(value) {
		return value;
	},
	
	keys(o) {
		return Object.keys(o);
	},
	
	//target, ...source, deep = true
	merge() {
		let target = arguments[0];
		let output = Object.assign({}, target);
		let deep = false;
		
		if (typeof arguments[arguments.length - 1] == 'boolean') {
			deep = true;
			[].pop.apply(arguments);
		}
		
		for (let i = 1; i < arguments.length; i++) {
			let source = arguments[i];
			if (this.isObject(target) && this.isObject(source)) {
				Object.keys(source).forEach(key => {
					if (this.isObject(source[key]) && deep) {
						if (!(key in target)) Object.assign(output, { [key]: source[key] });
						else
							output[key] = this.merge(target[key], source[key], deep);
					} else {
						Object.assign(output, { [key]: source[key] });
					}
				});
			}
		}
		
		return output;
	},
	
	diff(a, b) {
		return Object.keys(a).filter(x => !b.hasOwnProperty(x));
//		return a.filter(x => !b.includes(x));
	},
	
	difference(a, b) {
		return a.filter(x => !b.includes(x));
	},
	
	differenceWith(a, b, comparator) {
		if (comparator == undefined) comparator = this.isEqual;
		
		return a.filter(x => {
			for (let i in b) if (b.hasOwnProperty(i) && comparator(x, b[i])) return false;
			return true;
		});
	},
	
	includes(collection, value, fromIndex) {
		collection = (typeof collection == 'object')?Object.values(collection):collection;
		fromIndex = fromIndex?fromIndex:0;
		
		return fromIndex <= collection.length && collection.indexOf(value, fromIndex) > -1;
	},
	
	symDiff(a, b) {
		return a.filter(x => !b.includes(x)).concat(b.filter(x => !a.includes(x)));
	},
	
	maxBy(array, iteratee) {
		iteratee = this._checkIteratee(iteratee);
		
		if (!array || !array.length) return undefined;
		
		let result = array[0];
		let key = iteratee(result);
		let tmp = null;
		for (let i = 1; i < array.length; i++) {
			if (key < (tmp = iteratee(array[i]))) {
				result = array[i];
				key = tmp;
			}
		}
		
		return result;
	},
	
	isEqual(a, b) {
		function sort (o) {
            var result = {};

            if (typeof o !== "object" || o === null) {
                if (parseInt(o) == o) return parseInt(o);
                return o;
            }

            Object.keys(o).sort().forEach(function (key) {
                result[key] = sort(o[key]);
            });

            return result;
        }
        
		return JSON.stringify(sort(a)) === JSON.stringify(sort(b));
	},
	
	some(a, predicate) {
		if (typeof predicate == 'object') {
			let r = true;
			_.each(predicate, (v, k) => { r = r && (a[k] == v); })
			return r;
		} else {
			return (typeof predicate == 'function')?predicate(a):( (predicate == undefined)?a:(a == predicate) )
		}
	},
	
	filter(list, predicate) {
		let tmp = [];
		for (var i in list) if (list.hasOwnProperty(i) && this.some(list[i], predicate)) {
			tmp.push(list[i]);
		}
		
		return tmp;
	},
	
	find(list, predicate) {
		for (var i in list) if (list.hasOwnProperty(i) && this.some(list[i], predicate)) return list[i];
		return null;
	},
	
	findIndex(list, predicate) {
		for (var i in list) if (list.hasOwnProperty(i) && this.some(list[i], predicate)) return i;
		return -1;
	},
	
	sortBy(list, key) {
		var keys = Object.keys(list);
		
		keys.sort(function(a, b) {
		    return list[a][key].localeCompare(list[b][key]);
		});
		
		let tmp = [];
		
		keys.forEach(function(k) {
		   tmp.push(list[k]);
		});
		
		return tmp;
	},
	
	sumBy(list, cb) {
		let tmp = 0;
		for(var i in list) if (list.hasOwnProperty(i)) tmp += cb(list[i], i);
		return tmp;
	},
	
	reduce(list, iteratee, accumulator) {
		for (var i in list) if (list.hasOwnProperty(i)) {
			accumulator = (accumulator == undefined)?list[i]:iteratee(accumulator, list[i]);
		}
		return accumulator;
	},
	
	sum(list, key = null) {
		return this.sumBy(list, (v, i) => { return key?v[key]:v; })
	},
	
	isEmpty(c) {
		return (c == null) || (c == '') || (Object.keys(c).length == 0);
	},
	
	values(obj) {
		var res = [];
	    for (var i in obj) {
	        if (obj.hasOwnProperty(i)) {
	            res.push(obj[i]);
	        }
	    }
		return res;
	}
}

window._ = _;

})();
(function( w, d ) { 'use strict';

let $mx = function(selector, context) {
	if (selector instanceof $mx) return selector;
	return new $mx.fn.init( selector, context );
}

let readyList = new Promise((resolve, reject) => {
	function completed() {
		d.removeEventListener( "DOMContentLoaded", completed );
		w.removeEventListener( "load", completed );
		resolve($mx);
		
		readyList = null;
	}
	
	d.addEventListener( "DOMContentLoaded", completed );
	w.addEventListener( "load", completed );
});

readyList.then(() => {
	$mx(document).trigger('ready');
});

let cssProps = { 
	float: "cssFloat" 
}

function checkSelector(selector) {
	selector = selector.replace(/\:(first|last)([\x20\t\r\n\f])?/ig, ':$1-child$2');
	selector = selector.replace(/\:(checkbox|password|radio|reset|submit|text)([\x20\t\r\n\f])?/ig, '[type=$1]$2');
	return selector;
}	

$mx.fn = $mx.prototype  = {
	length: 0,
	constructor: $mx,
	
	init: function(selector, context) {
		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) return this;
		
		if (context instanceof $mx) context = context[0];
		if (selector instanceof $mx) return this.constructor(context).find(selector)

		if (typeof context == 'string') context = d.querySelector(checkSelector(context));

		// Handle $(DOMElement)
		let isWin = $mx.isWindow(selector);
		if ( selector.nodeType || isWin ) {
			if (selector.nodeType == 1 || selector.nodeType == 9 || isWin) {
				this[0] = selector;
				this.length = 1;
			}

			return this;
		}
		
		if (Array.isArray(selector) || (selector instanceof HTMLCollection)) {
			this.length = 0;
			for (let i = 0; i < selector.length; i++) {
				if (selector[i].nodeType == 1) {
					this[this.length] = selector[i];
					this.length++;
				}
			}
			return this;
		}
		
		if (typeof selector == 'function') {
			readyList?readyList.then(selector):selector($mx);
			return this;
		}		
		
		if (typeof selector == 'string') {
			
			let quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/;
			let match = quickExpr.exec( selector );
						
			
			if (match && match[1]) {
				// HANDLE: $(html) -> $(array)
				let template = d.createElement('template');
				let html = selector.trim();
				template.innerHTML = html;
				this.length = 1;
				this[0] = template.content.firstChild;
			} else {
				if (!context || (context.nodeType != undefined)) {
					// HANDLE: $("#id")
// 						whitespace = "[\\x20\\t\\r\\n\\f]";
					let elem = (context || d).querySelectorAll(checkSelector(selector));
					
					if (elem && elem.length) {
						this.length = elem.length;
						for (let i = 0; i < elem.length; i++) this[i] = elem[i];
					}
				}
			}
			
			return this;
		}
		
		if (typeof selector == 'object') {
			this[this.length] = selector;
			this.length++;
			return this;
		}
	},
	
	children: function() {
		if (!this.length) return this;
		let childrens = [];
		
		this.each((elem) => {
			childrens = _.concat(childrens, Array.prototype.slice.call(elem.children));
		});		
		
		return $mx(childrens);
	},
	
	parent: function(selector) {
		if (!this.length) return this;
	    let parents = [];
		
		this.each((elem) => {
			if (selector) {
				while (elem = elem.parentNode) {
					if ((typeof elem.matches == 'function')?elem.matches(selector):elem.matchesSelector(selector)) break;
				}
			} else {
				elem = elem.parentNode;
			}
			
			parents.push(elem);
		})

		return $mx(parents);
	},
		
	parents: function() {
	    let parents = [];
		
		this.each((o) => {
		    let p = this[0].parentNode;
		    while (p !== document) {
		        var o = p;
		        parents.push(o);
		        p = o.parentNode;
		    }
		})

	    parents.push(document);
	    return $mx(_.uniq(parents));
	},
	
	find: function(selector) {
		return this.length?$mx(selector, this[0]):this;
	},
	
	closest: function(selector) {
		return $mx(this.length?this[0].closest(selector):null);
	},
	
	attr: function(name, value) {
		if (value) {
			this.each(o => o.setAttribute(name, value));
			return this;
		} else {
			return this.length?this[0].getAttribute(name):null;
		}
	},
	
	removeAttr: function(name) {
		this.each(o => o.removeAttribute(name));
		return this;
	},
	
	hasAttr: function(a) {
		return typeof(this.attr(a)) != 'undefined';
	},
	
	get: function(idx) {
		return (this.length > idx)?$mx(this[idx]):null;
	},
	
	first: function() {
		return this.get(0);
	},
	
	each: function(cb) {
		for (let i = 0; i < this.length; i++) cb.apply(this[i], [this[i]]);
	},

	addClass: function(value, timeout) {
		_.each((value || "").split(/\s+/), (s) => {
			this.each(elem => elem.classList.add(s));
		});
		
		if (timeout != undefined) setTimeout(() => this.removeClass(value), timeout);
		return this;
	},
	
	removeClass: function(value) {
		if (!Array.isArray(value)) value = [value];
		
		_.each(value, v => {
			_.each((v || "").split(/\s+/), (s) => {
				this.each(elem => elem.classList.remove(s));
			})
		});
		
		return this;
	},
	
	hasClass: function(selector) {
		return this.length && this[0].classList.contains(selector);
	},
	
	toggleClass: function(value, state) {
		_.each((value || "").split(/\s+/), (s) => {
			this.each(elem => elem.classList.toggle(s, state));
		})

		return this;
	},
	
	remove() {
		this.each((elem) => { elem.remove(); });
		return this;
	},
		
	append: function(obj) {
		if (this.length) $mx(obj).each(o => this[0].appendChild(o))
		return this;
	},
	
	prepend: function(obj) {
		if (this.length) $mx(obj).each(o => this[0].insertBefore(o, this[0].children[0]))
		return this;
	},
	
	insertBefore: function(obj) {
		let element = $mx(obj)[0];
		return this.insertBeforeAfter(element, element)
	},
	
	insertAfter: function(obj) {
		let element = $mx(obj)[0];
		return this.insertBeforeAfter(element, element.nextSibling)
	},
	
	insertBeforeAfter: function(element, reference) {
		this.each((o) => {
			element.parentNode.insertBefore(o, reference);
		});
		
		return this;
	},
	
	appendTo: function(obj) {
		obj = $mx(obj);
		
		this.each((o) => {
			obj.append(o);
		});
		
		return this;
	},
	
	data: function(name, values) {
		if (values != undefined || typeof name == 'object') {
			values = (typeof name == 'object')?name:{[name]: values}

			_.each(values, (v, i) => {
				i = this.camelCase(i);
				this.each(o => o.dataset[i] = v);
			});
			
			return this;
		} else {
			if (this.length) {
				function checkType(v) {
					if (_.isInteger(v)) return parseInt(v);
					if (_.isFloat(v)) return parseFloat(v);
					return v;
				}
				
				if (name) {
					return checkType(this[0].dataset[name]);
				} else {
					let r = {};
					_.each(this[0].dataset, (v, i) => { r[i] = checkType(v); })
					return r;
				}
			} else {
				return [];
			}
			return this.length?(name?this[0].dataset[name]:this[0].dataset):[];
		}
	},
	
	index: function(elem) {
		if (!this.length) return -1;
		let nodes = null;
		
		if (elem) {
			nodes = elem.childNodes;
		} else {
			nodes = this[0].parentNode?this[0].parentNode.childNodes:[this[0]];
		}

		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] == this[0]) return i;
		}
		
		return -1;
	},
	
	triggerHandler: function(eventName, detail) {
		return this.trigger(eventName, detail, true)
	},
	
	trigger: function(eventName, detail, onlyHandler) {
		eventName = eventName.split('.')[0];
		this.each((o) => {
			let event;
			if (window.CustomEvent) {
				event = new CustomEvent(eventName, {detail: detail});
			} else {
				event = document.createEvent('CustomEvent');
				event.initCustomEvent(eventName, true, true, detail);
			}
			
			Object.defineProperty(event, 'target', {writable: false, value: o});		

			if (o.dispatchEvent != undefined && !onlyHandler) {
				o.dispatchEvent(event);
			} else {
				// Не DOM события
				if (o.$tinyquery != undefined && o.$tinyquery[eventName] != undefined) {
					_.each(o.$tinyquery[eventName], (o) => {
						if (!Array.isArray(detail)) detail = [detail];
						detail.unshift(event);
						o.cb.apply(this, detail);
					});
				}
			}
			
			// Для selector event
			document.body.dispatchEvent(event);
		});
		
		return this;
	},
	
	_triggerEvent: function(e) {
		let obj = this;

		_.each(obj.$tinyquery[e.type], (o) => {
			let result = true;
			let target = e.target;
			
			if (o.selector) {
				do {
					if (target.nodeType == 1) {
						let matches = (typeof target.matches == 'function')?target.matches(o.selector):target.matchesSelector(o.selector);
						if (matches) result = o.cb.apply(target, [e]);
					}
				} while ((target = target.parentNode) && (target.nodeType != 9))
			} else {
				result = o.cb.apply(obj, [e]);
			}
			
			if (result === false) {
				e.preventDefault();
				e.stopPropagation();
			}
		})
	},
	
	on: function(types, selector, cb) {
		if (typeof selector == 'function') {
			cb = selector;
			selector = null;
		}

		if (cb == null || cb == undefined) return;
		
		let self = this;

		_.each(types.replace(/[ ]+/, ' ').split(' '), name => {
			name = name.split('.')[0];
			this.each((o) => {
				if (o.$tinyquery == undefined) o.$tinyquery = {};
				if (o.$tinyquery[name] == undefined) o.$tinyquery[name] = [];
				
				if (selector) {
					selector = checkSelector(selector);
					_.each(selector.replace(/[ ]+/, ' ').split(','), (s) => o.$tinyquery[name].push({selector: s, cb: cb}));
				} else {
					o.$tinyquery[name].push({cb: cb})
				}

				if (o.addEventListener != undefined) {
					o.addEventListener(name, self._triggerEvent);
				}
			});
		});

		return this;
	},
	
	one: function(types, selector, cb) {
		if (typeof selector == 'function') {
			cb = selector;
			selector = null;
		}

		let self = this;
		
		let cb2 = (e) => {
			cb.apply(this, [e]);
			self.off(types, selector, cb2);
		}
		
		return this.on(types, selector, cb2);
	},
	
	off: function(types, selector, cb) {
		if (typeof selector == 'function') {
			cb = selector;
			selector = null;
		}
		
		let self = this;

		_.each(types.replace(/[ ]+/, ' ').split(' '), name => {
			name = name.split('.')[0];
			this.each((o) => {
				// нет selector и нет cb, тость убираем все
				if (!selector && !cb) {
					o.removeEventListener(name, self._triggerEvent);
					if (o.$tinyquery != undefined && o.$tinyquery[name] != undefined) delete o.$tinyquery[name];
				} else {
					if (selector) {
						_.each(selector.replace(/[ ]+/, ' ').split(','), (s) => {
							if (o.$tinyquery != undefined && o.$tinyquery[name] != undefined) {
								for (let i = 0; i < o.$tinyquery[name].length; i++) {
									let event = o.$tinyquery[name][i];
									if ((event.selector == s) && ((event.cb == cb) || !cb)) {
										o.$tinyquery[name].splice(i, 1);
										break;
									}
								}
							}
						});
					} else {
						if (o.$tinyquery != undefined && o.$tinyquery[name] != undefined) {
							for (let i = 0; i < o.$tinyquery[name].length; i++) {
								let event = o.$tinyquery[name][i];
								if ((event.cb == cb) || !cb) {
									o.$tinyquery[name].splice(i, 1);
									break;
								}
							}
						}
					}
					
					if (o.$tinyquery != undefined && o.$tinyquery[name] != undefined && !o.$tinyquery[name].length) {
						o.removeEventListener(name, self._triggerEvent);
						delete o.$tinyquery[name];
					}
				}
			});
		});

		return this;
	},
	
	delegate: function (selector, types, fn) {
		return this.on(types, selector, fn);
	},
	
	undelegate: function (selector, types, fn) {
		return this.off(types, selector, fn);	
	},
	
	val: function(v) {
		if (v == undefined) {
			return (this.length && ['INPUT', 'TEXTAREA'].indexOf(this[0].tagName) != -1)?this[0].value:null;
		} else {
			this.each((o) => {
				if (['INPUT', 'TEXTAREA'].indexOf(o.tagName) != -1) o.value = v;
			})
			
			return this;
		}
	},
	
	is: function(selector) {
		if (!this.length) return false;
		return (typeof this[0].matches == 'function')?this[0].matches(selector):((typeof this[0].matchesSelector == 'function')?this[0].matchesSelector(selector):false);
	},
	
	has: function(target) {
		return this.filter((i, elem) => {
			let targets = $mx(target, elem);
			for (let i = 0; i < targets.length; i++) {
				if (elem.contains(targets[i])) return elem; 
			}

			return false;
		});
	},
	
	filter: function(cb) {
		if (typeof cb != 'function') return this.has(cb);
		
		let result = [];
		for (let i = 0; i < this.length; i++) {
			if (cb.apply(this[i], [i, this[i]])) result.push(this[i]);
		}

		return $mx(result);
	},
		
	html: function(v) {
		if (v != undefined) {
			if (v instanceof $mx) v = v.length?v[0].outerHTML:'';
			if (v.outerHTML != undefined) v = v.outerHTML;

			this.each((o) => {
				o.innerHTML = v;
			});
			
			return this;
		} else {
			return this.length?this[0].innerHTML:null;
		}
	},
	
	text: function(v) {
		if (v != undefined) {
			this.each((o) => {
				o.innerText = v;
			});
			
			return this;
		} else {
			return this.length?((typeof this[0].textContent == 'string')?this[0].textContent:this[0].innerText):'';
		}
	},
	
	empty: function() {
		return this.html('');
	},
	
	hide() {
		return this.toggle(false);
	},
	
	show() {
		return this.toggle(true);
	},
	
	toggle(state) {
		this.each((o) => {
			o.style.display = (state == undefined)?((o.style.display == 'none')?'block':'none'):(state?'block':'none');
		});
		
		return this;
	},
	
	focus() {
		this.length && this[0].focus();
//		return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
	},

	offset: function() {
		if (this.length) {
			var left = 0, top = 0;
			
			let elem = this[0];
			while (elem) {
				left += elem.offsetLeft;
				top += elem.offsetTop;
				elem = elem.offsetParent;
			}

			return {left: left, top: top}
		} else {
			return {left: null, top: null}
		}
		
	},
		
	position: function() {
		return this.length?{left: this[0].offsetLeft, top: this[0].offsetTop}:{left: null, top: null}
	},
	
	_scrollValue: function(method) {
		let props = { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }
		let elem = this[0];
		let win = $mx.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
		return  win?win[props[method]]:elem[method];
	},
	
	scrollTop: function() {
		return this._scrollValue('scrollTop');
	},

	scrollLeft: function() {
		return this._scrollValue('scrollLeft');
	},
	
	next: function() {
		return this.length?$mx(this[0].nextElementSibling || this[0].nextSibling):this;
	},
	
	prev: function() {
		return this.length?$mx(this[0].previousElementSibling || this[0].previousSibling):this;
	},
	
	eq: function(idx) {
		return $mx((this.length > idx)?this[idx]:null);
	},
	
	//todo: get 
	css: function(name, value) {
		let normalValue = (n, v) => {
			if (['width', 'height', 'left', 'top', 'right', 'bottom'].indexOf(n) != -1 && _.isNumber(v)) {
				v += 'px';
			}
			
			return v;
		}
		
		let normalName = (n) => {
			return (cssProps[n] != undefined)?cssProps[n]:this.camelCase(n);
		}
		
		if (typeof name == 'object') {
			for (let i in name) {
				let cc = normalName(i);
				name[i] = normalValue(cc, name[i]);
				this.each((o) => o.style[cc] = name[i]);
			}
			return this;
		} else {
			name = normalName(name);
			
			if (value != undefined) {
				value = normalValue(name, value);
				this.each((o) => {
					o.style[name] = value;
				})
				return this;
			} else {
				var view = this[0].ownerDocument.defaultView;

				if (!view || !view.opener) view = window;
				return this[0].style[name] || view.getComputedStyle(this[0]).getPropertyValue(name) || null;
			}
		}
	},
	
	camelCase(value) {
		return value.replace( /-([a-z])/g, ( all, letter ) => {
			return letter.toUpperCase();
		});
	},
	
	map: function(cb) {
		return _.map($mx.makeArray(this), p => cb.apply(p));
	},
	
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},
	
	outerHeight: function() {
		let styles = window.getComputedStyle(this[0]);
		let margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
		return this[0].offsetHeight + margin;
	},
	
	outerWidth: function() {
		let styles = window.getComputedStyle(this[0]);
		let margin = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']);
		return this[0].offsetWidth + margin;
	},
	
	submit: function() {
		this.length && this[0].submit();
		return this;
	}
}

_.each(['click', 'resize', 'scroll', 'keypress', 'keydown', 'change', 'mouseenter', 'mouseleave', 'ready', 'load'], (name) => {
	$mx.fn[name] = function(selector, cb) {
		if (selector == undefined && cb == undefined) {
			return this.trigger(name);
		} else {
			return this.on(name, selector, cb);
		}
	}
});


_.each(['height', 'width'], (name) => {
	//_.each(['inner', 'outer', ''], (prefix) => {
		let func = name;//prefix?(prefix+name.substr(0, 1).toUpperCase() + name.substr(1)):name;
		$mx.fn[func] = function() { 
			if (this.length == 0) return null;

			let elem = this[0];
			
			let type = name.substr(0, 1).toUpperCase() + name.substr(1);
			
			if ($mx.isWindow(elem)) {
				// const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
				return elem['innerHeight'];
			} else if (elem.nodeType == 9) {
				let doc = elem.documentElement;
				return Math.max(
					elem.body["scroll" + type], doc["scroll" + type],
					elem.body["offset" + type], doc["offset" + type],
					doc["client" + type]
				);			
			} else {
				let style = w.getComputedStyle(this[0], null);
				return parseInt(style.getPropertyValue(func));
			}
		}
	//});
});

$mx.contains = function (context, elem) {
	context.contains(elem);
}

$mx.isWindow = function(obj) {
	return obj != null && obj === obj.window;
}

$mx.isFunction = function (obj) {
	return typeof obj === "function" && typeof obj.nodeType !== "number";
}

$mx.isset = function (a) {
	return typeof(a) != 'undefined' && a != null;
}

$mx.nvl = function(a,b) {
	return (typeof(a) == 'undefined' || a == null)?b:a;
}

$mx.param = function(obj, prefix) {
	var str = [];
	for (let p in obj) {
	    if (obj.hasOwnProperty(p)) {	
		    if (obj[p] == undefined) obj[p] = '';
		    if (typeof obj[p] == 'boolean') obj[p] = obj[p]?1:0;
		    let k = prefix ? prefix + "[" + p + "]" : p,
	        v = obj[p];
			str.push((v !== null && typeof v === "object") ?
	        $mx.param(v, k) :
	        encodeURIComponent(k) + "=" + ((v !== null)?encodeURIComponent(v):''));
	    }
  	}

  	return str.join("&");
}

$mx.getScript = function(url) {
	var a = document.createElement('script');
	a.type = 'text/javascript';
	a.src = url;
	document.head.appendChild(a);
}

$mx.extend = $mx.fn.extend = function() {
	let deep = false;
	let i = 0;
	let length = arguments.length;
	let extended = this;

	if (typeof arguments[0] == 'boolean') {
		deep = arguments[0];
		i++;
	}
	
	if (length > i+1) {
		extended = arguments[i];
		i++;
	}
	
	return _.merge(extended, arguments[i], deep);
};

$mx.each = function(list, cb) {
	for(let i in list) if (list.hasOwnProperty(i)) cb(i, list[i]);
}

$mx.makeArray = function(o) {
	let r = [];
	for (let i = 0; i < o.length; i++) r.push(o[i]);
	return r;
}

$mx.proxy = function(fn, context) {
	let args = Array.prototype.slice.call(arguments, 2);
	return function() {
		return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
	}
}

$mx.fn.init.prototype = $mx.fn;
w.$mx = $mx;

})(window, document);

(function( w, d ) {
/*
	url
	method
	data
	headers
	onUploadProgress
*/
$mx.request = function(options)	{
	return new Promise((resolve, reject) => {
		let data = {
			headers: Object.assign($mx.nvl(options.headers, {}), {'X-Requested-With': 'XMLHttpRequest'}),
			method: options.method || 'get',
			credentials: options.credentials || 'same-origin'
		}
		
		let func = null;

		switch (data.method) {
			case 'get':
				options.data = options.data || options.json;
				options.url = options.url + (_.isEmpty(options.data)?'':('?'+$mx.param(options.data)));
				break;
			case 'post':
				if (options.json != undefined) {
					data.body = JSON.stringify(options.json);
					data.headers['Content-Type'] = 'application/json';
				} else {
					if (options.data instanceof FormData) {
						data.body = options.data;
					} else if (typeof options.data == 'object') {
						data.body = $mx.param(options.data);
						data.headers['Content-Type'] = 'application/x-www-form-urlencoded';
					} else {
						data.body = options.data;
					}
				}
				break;
		}
		
		fetch(options.url, data).then((r) => {
			let contentType = r.headers.get('Content-Type');
			let cb = (data) => {
				resolve({data: data, headers: r.headers, status: r.status})
			}
			if (contentType.split(';')[0] == 'application/json') {
				r.json().then(cb).catch(reject);
			} else {
				r.text().then(cb).catch(reject);
			}
		}).catch(reject);
	})
}

$mx.get = function(url, data) {
	return $mx.request({url: url, method: 'get', data: data});
}
	
$mx.post = function(url, data) {
	return $mx.request({url: url, method: 'post', data: data});
}

})(window, document);

+function (w) { "use strict";
	
$mx.lazyScripts = new Array();
$mx.lazyScriptsLoading = new Array();

$mx(function() {
	$mx.lazyScripts = $mx.makeArray($mx('script[src]').map(function() { var m = this.src.match(/([^\/]+)(\?[0-9\.]+)?$/); return m?m[1]:null; }));
});


$mx.lazy = function(scripts, styles, delegate) {
	if (typeof styles == "function") {
		delegate = styles;
		styles = null;
	}
	
	if (styles == null || styles == undefined) {
		styles = [];
	}
	
	let lazyAmount = 0;
	let m = document.querySelector("link[type='text/css']").href.match(/\?([0-9\.]+)/);
	let scriptsVersion = m?m[0]:'';
	
	let onCompleteLazy = () => {
		lazyAmount--;
	
		if ((lazyAmount == 0) && (typeof delegate == "function")) {
			delegate();
		}
	}	

	let onloadedLazy = (filename) => {
		for (let y in $mx.lazyScriptsLoading[filename]) {
			$mx.lazyScriptsLoading[filename][y].apply();
		}
		
		$mx.lazyScripts.push(filename);
		delete $mx.lazyScriptsLoading[filename];
	}
	
	let loadScript = (filename) => {
		if ($mx.lazyScripts.indexOf(filename) != -1) {
			onCompleteLazy();
		} else {
			if ($mx.lazyScriptsLoading[filename] == undefined) $mx.lazyScriptsLoading[filename] = [];
			$mx.lazyScriptsLoading[filename].push(onCompleteLazy);
	
			var a = document.createElement('script');
// 			a.async = true;
			a.type = 'text/javascript';
			if (filename.indexOf('//') != -1) {
				a.src = filename;
			} else {
				a.src = '/s/js/'+filename+scriptsVersion;
			}
			
			a.onload = () => { onloadedLazy(filename) };
			document.head.appendChild(a);
		}
	}

	let loadStyle = (filename) => {
		if ($mx.lazyScripts.indexOf(filename) != -1) {
			onCompleteLazy();
		} else {
			if ($mx.lazyScriptsLoading[filename] == undefined) $mx.lazyScriptsLoading[filename] = [];
			$mx.lazyScriptsLoading[filename].push(onCompleteLazy);

			var c = document.createElement('link');
			c.setAttribute("rel", "stylesheet");
			c.setAttribute("type", "text/css");
			if (filename.substring(0, 2) == '//') {
				c.setAttribute("href", filename);
			} else {
				c.setAttribute("href", '/s/css/'+filename+scriptsVersion);
			}
			c.onload = () => { onloadedLazy(filename) };
			document.head.appendChild(c);
		}
	}
	
	if (typeof scripts == 'string') scripts = [scripts];
	if (typeof styles == 'string') styles = [styles];
	
	lazyAmount = scripts.length + styles.length;
	
	if (lazyAmount) {
		for (i = 0; i < scripts.length; i++) loadScript(scripts[i]);
		for (i = 0; i < styles.length; i++) loadStyle(styles[i]);
	} else {
		delegate();
	}
}

}(window);
+function (d, w) { "use strict";
	
	var observer_list_add = [];
	var observer_list_remove = [];
	
	$mx.observe = function(selector, onAdd, onRemove) {
		$mx(function() {
			if (onAdd) {
				$mx(selector).each(function() { onAdd.call(this, $mx(this)); });
				observer_list_add.push([selector, onAdd]);
			}
			
			if (onRemove) {
				observer_list_remove.push([selector, onRemove]);
			}
		});
	}
		
	$mx(function() {
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

		if (!$mx.isset(MutationObserver)) {
			MutationObserver = function(callback) {
				this.onAdded = function(e) {
					callback([{ addedNodes: [e.target], removedNodes: [] }])
				}
				this.onRemoved = function(e) {
					callback([{ addedNodes: [], removedNodes: [e.target] }])
				}
			}
			
			MutationObserver.prototype.observe = function(target) {
				target.addEventListener('DOMNodeInserted', this.onAdded)
				target.addEventListener('DOMNodeRemoved', this.onRemoved)
			}
		
		}

		function matches(el, selector) {
			var fn = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector
			return fn ? fn.call(el, selector) : false
		}
		
		function apply(nodes, list) {
			for (let i=0; i < list.length; i++) {
				let selector = list[i][0];
				let result = [];
			
				for (var j=0; j < nodes.length; j++) {
					let node = nodes[j];
					
					if (node.nodeType !== 1) continue;
					
					if (matches(node, selector)) {
						result.push(node);
					}
					
					let childs = node.querySelectorAll(selector);
					for (let c=0; c < childs.length; c++) result.push(childs[c]);
				}
				
				if (!result.length) continue;
				
				result.filter(function(node, id, self) {
					// Убираем дубли
					return self.indexOf(node) === id
				}).forEach(function(node) {
					list[i][1].call(node, $mx(node));
				})
			}
		}		
		
		var observer = new MutationObserver(function(mutations) {
			
			var addedNodes   = []
			var removedNodes = []
			
			mutations.forEach(function(mutation) {
				addedNodes.push.apply(addedNodes, mutation.addedNodes)
				removedNodes.push.apply(removedNodes, mutation.removedNodes)
			})		
			
			// filter moved elements (removed and re-added)
			for (var i = 0, len = removedNodes.length; i < len; ++i) {
				var index = addedNodes.indexOf(removedNodes[i])
				if (index > -1) {
					addedNodes.splice(index, 1)
					removedNodes.splice(i--, 1)
				}
			}		
			
			apply(addedNodes, observer_list_add);
			apply(removedNodes, observer_list_remove);
			
			addedNodes.length   = 0
			removedNodes.length = 0					
		})

		observer.observe(d.body, { childList: true, subtree: true });
	});
		
}(document, window);
/*
$.nvl = function(a,b) {
	return (typeof(a) == 'undefined' || a == null)?b:a;
}

$.isset = function (a) {
	return typeof(a) != 'undefined';
}

$.fn.hasAttr = function(a) {
	return typeof($(this).attr(a)) != 'undefined';
}
*/

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

/*
$.app = {
	body: 'body',
	isApplication: false,
	domain: '',
	init: function () {	}
}
*/

//  navigator.sendBeacon('/analytics', data); <- стату отправлять так

/*

$.go = function(d, is_native, is_replace) {
	$('.modal.in').modal('hide');
// 	$($.app.body).removeClass('open-menu')

	if (typeof(d) == 'undefined') d = document.location.href;
	i = d.indexOf("#");
	if (i != -1) d = d.substr(0, i);
	if (is_native) {
		document.location = d;
	} else {
		$mx.router.open(d, 'replace', null, null, null, is_replace);
	}
}
*/



function go(d) {
	if (typeof(d) == 'undefined') d = document.location.href;
	i = d.indexOf("#");
	if (i != -1) d = d.substr(0, i);
	document.location = d;
}

$mx(function() {
	$mx(document.body).on('click', 'a[href="#"]', function(e) {
      e.preventDefault();
    });	

	if (document.location.hash.indexOf('#event=') != -1) {
		var p = document.location.hash.split('=');
		$mx('[href="#'+p[1]+'"]').click();
		
	} 
	
	$mx(document.body).on('keydown', '.skip-enter', function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});	
});

/*
function updateBlock(classname) {
	$('.'+classname).each(function() {
		var url = $(this).data('update-url');
		if (url) $(this).load(url);
	});
}
*/
/*

$.application = {
	name : null,
	topOffset: 0
}

$.layout = {
	current_path: '',

	isAuthorized: function() {
		return $('body').hasClass('authorized');
	},
	
	lang: function() {
		return $(document.body).data('lang');	
	},
	
	setCurrentPath: function(path) {
		if (path == undefined) path = document.location.pathname+document.location.search;
		$.layout.current_path = path;
	},
	
	hash: {
		current: '',
		inited: false,
		cb: null, 
		
		push: function(hash) {
			if (!$.layout.hash.inited) return;
			
			var h = document.location.hash;
			if (document.location.hash) h += ':';
			h += ((hash == undefined)?'none':hash);
			$.layout.hash.current = document.location.hash = h;
		},
		
		replace: function(hash) {
			var h = document.location.hash.split(':');
			h[h.length-1] = hash;
			
			$.layout.hash.current = document.location.hash = h.join(':');
		}	
	},
	
	isIOS: navigator.userAgent.match(/iphone|ipod|ipad/gi) != null,
	isTouch: 'ontouchstart' in window || 'onmsgesturechange' in window
};
*/



/*
$.window = {
	bindScroll: function(handler) {
		$($.window).bind('scroll', handler);
	},

	unbindScroll: function(handler) {
		$($.window).unbind('scroll', handler);
	},

	defaultHandler: function() {
		$($.window).triggerHandler('scroll', {scrollTop: this.pageYOffset, windowHeight:$(window).height()});
	},

	init: function() {
		$(window).bind('scroll resize', $.window.defaultHandler);
	}
}
*/

/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
var m = document.querySelector("link[type='text/css']").href.match(/\?([0-9\.]+)/);
var scriptsVersion = m?m[0]:'';

window.$events = {
	events: {},
	waits: {},
	
	on(name, cb, fireOld = false) {
		if (this.events[name] == undefined) this.events[name] = [];
		this.events[name].push(cb);
		
		// Если данные ушли раньше чем был .on, то выполняем их, но только первый .on заберет все данные
		if (fireOld && (this.waits[name] != undefined)) {
			_.each(this.waits[name], (v) => {
				cb(null, v);
			});
			
			delete this.waits[name];
		}
	},
	
	one(name, cb) {
		let cb2 = () => {
			cb();
			this.off(name, cb2);
		}

		this.on(name, cb2);
	},
	
	off(name, cb) {
		if (cb) {
			if (this.events[name] != undefined) {
				for (let i=0; i<this.events[name].length; i++) {
					if (this.events[name] === cb) {
						this.events[name].splice(i, 1);
						break;
					}
				}
			}
		} else {
			delete this.events[name];
		}
	},
	
	fire(name, o) {
		if (this.events[name] != undefined) {
			for (let i=0; i<this.events[name].length; i++) {
				this.events[name][i](null, o)
			}
		} else {
			if (this.waits[name] == undefined) this.waits[name] = [];
			this.waits[name].push(o)
		}
	}
}

$mx.observe('.map-view-init', function(o) {
	$mx.lazy('map.js', 'map.css', function() {
		var d = o.data();
		var options = JSON.parse(o.find('script[type="text/data"]').text());
		var markers = JSON.parse(o.find('script[type="text/markers"]').text());
		
		if (d.showZoom) o.addClass('map-view-with-zoom-control');
	
		var map = L.map(o[0], {
			dragging: !d.isFixed,
			doubleClickZoom: !d.isFixed,
			boxZoom: !d.isFixed,
			touchZoom: !d.isFixed,
			scrollWheelZoom: !d.isFixed,
			doubleClickZoom: !d.isFixed,
			zoomControl: true,
			attributionControl: false,
		}).setView([parseFloat(options.center.lat), parseFloat(options.center.lng)], options.zoom);
		
		if (options.bounds) map.fitBounds(options.bounds);
		
		L.control.attribution({prefix: ''}).addTo(map);

		//'https://maps.tilehosting.com/styles/basic/{z}/{x}/{y}.png?key=nN7lJ1jrAkjwLR6mBnns'
		L.tileLayer('/maps/{z}/{x}/{y}.png', {
	        attribution: '<a href="https://taplink.cc" target="_blank">Taplink</a> <span style="color:#ccc">|</span> <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
	        crossOrigin: true
		}).addTo(map);
		
		var icon = L.icon({
		    iconUrl: '/s/i/marker.png',
		    iconSize: [28, 37],
// 		    iconAnchor: [22, 94],
		    popupAnchor: [0, -10],
		    shadowUrl: '/s/i/marker-shadow.png',
		    shadowSize: [40, 50],
		    shadowAnchor: [12, 31]
		});
		
		let b = map.getBounds();
		
		//b = JSON.parse('{"_southWest":{"lat":58.00382307136166,"lng":56.2247657775879},"_northEast":{"lat":58.03418980610332,"lng":56.326904296875}}');
		//b = [[58.00382307136166, 56.2247657775879],[58.03418980610332,56.326904296875]];
		//map.fitBounds(b);
		
/*
		let resize = (e) => {
			let width = o.parent().width();
			console.log(width);
			console.log(width/548	);

			let sc = (548/width);
			let w = (sc*100);
			console.log(((1-sc)*100));
			
			map.fitBounds(b);
// 			o.css((sc < 1)?{transform:'scale(1)', width: '100%', left: '0'}:{transform:'scale('+sc+')', width: w+'%', left: '-'+((100-w)/2)+'%'});
//			map.setZoom(options.zoom+(e.newSize.x/548));
		}
*/
		
// 		map.on('resize', resize);
// 		resize({newSize: {x: o.width()}});
		
		for (var i = 0; i < markers.length; i++) {
			var v = markers[i];
			var marker = L.marker([parseFloat(v.lat), parseFloat(v.lng)], {icon: icon}).addTo(map);
			marker.bindPopup("<b>"+v.title+"</b>"+(v.text?('<div>'+v.text.replace(/\n/g, '<br>')+'</div>'):''));//.openPopup();
		}
	});
});  
$mx.observe('[type="tel"]', function(o) {
	if ((o.is('.skip-init') || !o.closest('.form-field').length) && !o.is('.need-init')) return;
	
	o.addClass('skip-init');
	
	let iti = null;
	let val = o.val();
	
	
	$mx.lazy('phone.js', () => {
		let country = o.data('country');
		
		iti = intlTelInput(o[0], {
			initialCountry: country?country:"auto",
			defaultCountry: country?country:"auto",
			preferredCountries: _.uniq([country, 'ru', 'ua', 'by', 'kz']),
			separateDialCode: true,
			autoHideDialCode: false,
			nationalMode: true,
		});
		
		o[0].iti = iti;
		
		
		o.attr('mx-input-type', 'phone').addClass('mx-validate').on('change keyup keydown keypress countrychange', (e) => {
//			var val = iti.getNumber().toString().trim().replace(/[^0-9\+]/g, '');
			var val = e.target.value.trim().replace(/[^0-9\+]/g, '');
			val = val?val:'';
						
			
// 			var c = intlTelInput("getSelectedCountryData");
			var c = iti.getSelectedCountryData();
	
			// Если начинаетсяс кода — убираем код
//			if (c.dialCode != undefined && (val.substr(0, (c.dialCode.toString().length+1)*2) == '+'+c.dialCode+'+'+c.dialCode)) {

			if (c.dialCode != undefined && (val.substr(0, (c.dialCode.toString().length+1)) == '+'+c.dialCode)) {
				val = val.substr(c.dialCode.toString().length+1);
				iti.setNumber(val);
			}
/*
			else {
				iti.setNumber(val);
			}
*/

			
			// Если только код - зануляем, чтобы было пусто
			if (c.dialCode != undefined && ('+'+c.dialCode == val)) val = '';
			
			
	
//			var isValid = o.intlTelInput("isValidNumber") || (val == '');
			var isValid = iti.isValidNumber() || (val == '');

			var phone = o.closest('.iti').parent().find('.tel-phone');
			phone.val(val?(c.dialCode+val):val)

			
			var code = o.closest('.iti').parent().find('.tel-code');
			val = iti.getNumber().toString().trim().replace(/[^0-9\+]/g, '');
			
			code.val(val).trigger('change', {value: iti.getNumber().toString().trim().replace(/[^0-9\+]/g, '')});
			
			var valid = o.closest('.iti').parent().find('.tel-valid');
			valid.val(isValid?1:0).trigger('change');
		}).on('blur', (e) => {
			var val = e.target.value.trim().replace(/[^0-9\+]/g, '');
			iti.setNumber(val);
		}).trigger('countrychange');
	});
}, function(o) {
	if ((o[0].iti != undefined) && o[0].iti) o[0].iti.destroy();
});
$mx(function() {
	var body = $mx(document.body);
	var panZoomObject = null;
	
/*
	body.on('click', '.slider-arrow-right, .slider-arrow-left', function() {
		var p = $mx(this).parent();
		var idx = p.find('.slider-dot.active').index() + ($mx(this).is('.slider-arrow-right')?1:-1);
 		var dots = p.find('.slider-dot').removeClass('active');
 		if (idx >= dots.length) idx = 0;
 		if (idx < 0) idx = dots.length - 1
 		dots.eq(idx).addClass('active');
		p.find('.slider-slide').css({'transform': 'translateX(-'+idx*100+'%)'});
	});
*/
	function isMobile() {
		return window.matchMedia("(max-width: 767px)").matches?true:false;
	}

	function isDesktop(o) {
		return (window.matchMedia("(min-width: 1200px)").matches?true:false) && (o.closest('.is-allow-fullwidth').length > 0);
		//(o.closest('.main-block, .modal, [data-allow-zoom]').length == 0);
	}
	
/*
	function isTouch() {
		return ('ontouchstart' in window)?true:false;
	}
*/
	
	function checkPictureSrc(picture, is_second = false) {
		if (picture.attr('data-picture')) {
			if (picture.data('picture')) picture.css('background-image', 'url('+picture.data('picture')+')');
			picture.attr('data-picture', null);
		}
		
		// Если это не телефон, то картинку справа видно сразу и ее мы загружаем
		if (!is_second && (isMobile() || isDesktop(picture))) {
			checkPictureSrc(picture.closest('.slider-slide').next().find('.picture-container'), true);
			checkPictureSrc(picture.closest('.slider-slide').prev().find('.picture-container'), true);
		}
	}
	
	function moveSlide(o, user) {
		var idx = o.index();
		
		var p = o.closest('.slider');
		var slides = p.find('.slider-slide').removeClass('active');
		var dots = p.find('.slider-dot').removeClass('active');
		var picture = p.find('.picture-container').eq(idx);

		if (user) {
			var sp = o.closest('.slider-pictures[data-interval]');
			if (sp.length) {
				clearInterval(sp.attr('data-time'));
			}
		}

		var slider = picture.closest('.slider');
		
		if (!slider.length) return;
		
		var sc = $mx(document).scrollTop();
		var wn = $mx(window).height();
		
		var os = $mx(slider[0]).offset().top;//slider[0].offsetTop;
		var oh = slider[0].offsetHeight;
		
		if (os < sc+wn && (os+oh > sc)) {
			checkPictureSrc(picture);
		}
		
		dots.eq(idx).addClass('active');
		slides.eq(idx).addClass('active');
		
		slides.css({'transform': 'translateX(-'+idx*100+'%)'+(isDesktop(o)?' scale(.94)':'')});
		slides.eq(idx).css({'transform': 'translateX(-'+idx*100+'%)'+(isDesktop(o)?' scale(1)':'')});
		
		p.triggerHandler('change', [idx]);
		p.triggerHandler('changeindex', [idx]);
	}
	
	function setSliderInterval(o) {
		var dots = o.find('.slider-dot');
		
		var timeID = o.attr('data-time');
		if (timeID) {
			clearInterval(timeID);
		}
		
		var timeID = setInterval(function() {
			if (!o.data('is-sliding')) {
				var active = o.find('.slider-dot.active').index();
				moveSlide(dots.eq((active < dots.length-1)?(active+1):0), false);
			}
		}, Math.max(o.data('interval'), 1)*1000);
		
		o.attr('data-time', timeID);
	}

	body.on('click', '.slider-dot', function() {
		var o = $mx(this);
		//var p = o.closest('.slider-pictures[data-interval]');
		//if (p.length) setSliderInterval(p);
		moveSlide(o, true);
	}).on('click', '.slider-slide:not(.active)', function() {
		var o = $mx(this);
		if (isDesktop(o)) moveSlide(o, true);
	}).on('touchstart', '.slider', function(o) {
		var t = $mx(o.target);
		
		var p = t.closest('.slider');
		var sp = t.closest('.slider-pictures');
		var width = t.width(); 
		var height = t.height(); 
		var startX = o./* originalEvent. */touches[0].pageX;
		var startY = o./* originalEvent. */touches[0].pageY;
		var slides = p.find('.slider-slide');
		var dots = p.find('.slider-dot');
		var idx = p.find('.slider-dot.active').index();
		var amount = dots.length;
		var deltaX = 0;
		var deltaY = 0;
		var startTime = 0;
		var x = 0;
		var y = 0;
		
		var startZoomDeltaX = 0;
		var startZoomDeltaY = 0;
		var startZoomX = 0;
		var startZoomY = 0;
		
		var isAllowZoom = p.data('allow-zoom');
		
		var startDirection = null;
		
		sp.data('is-sliding', 1);
		
		slides.addClass('stop-transition');
		
// 		if (slides.length < 2) return;
		
		t.on('touchmove', function(e) {
			t = e./* originalEvent. */touches;
			x = t[0].pageX;
			y = t[0].pageY;
			
			deltaX = Math.ceil((x - startX) / width * 100);
			deltaY = Math.ceil((y - startY) / height * 100);
			
			if (t.length > 1 && !startDirection && isAllowZoom) {
				let b = e.target.getBoundingClientRect();

				if ($mx('.pan-zooming-background').length == 0) {
					$mx('<div class="pan-zooming-background"></div>').appendTo(body);
					$mx('html').addClass('is-clipped');
					panZoomObject = $mx(e.target).clone();
					panZoomObject.appendTo(body);
					panZoomObject.addClass('is-pan-zooming').css(b);
					
					startZoomX = t[1].pageX;
					startZoomY = t[1].pageY;
					startZoomDeltaX = Math.abs(x - startZoomX);
					startZoomDeltaY = Math.abs(y - startZoomY);
				}
				

				let scaleX = 1 + ((Math.abs(x - t[1].pageX) - startZoomDeltaX) / width);
				let scaleY = 1 + ((Math.abs(y - t[1].pageY) - startZoomDeltaY) / height);
				let scale = Math.max(scaleX, scaleY, 1);
				
				//let deltaZoomX = 
				// Тут сделано круто но с хамером https://codepen.io/bakho/pen/GBzvbB
				
				// translateX('+deltaX+'px) translateY('+deltaY+'px) translateZ(0px) 
				// translateX('+((x - startX) /* + (t[1].pageX - startZoomX) */)+'px) translateY('+((y - startY)/*  + (t[1].pageY - startZoomY) */)+'px) translateZ(0px)  
					
				panZoomObject.css('transform', 'translateX(0px) translateY(0px) translateZ(0px) scale('+scale+', '+scale+')');
			} else {
				startTime = e.timeStamp;
	
				if (Math.abs(deltaY) > Math.abs(deltaX) && (startDirection != 'x')) {
					startDirection = 'y';
					return true;
				} else {
					if (startDirection != 'y') {
						if (idx == 0 && deltaX > 0) deltaX = 0;
						if (idx == amount -1 && deltaX < 0) deltaX = 0;
						slides.css('transform', 'translateX('+(deltaX - (idx * 100))+'%)');
						startDirection = 'x';
					}
				}
			}			

			if (e.cancelable) {
				e.preventDefault();
				e.stopPropagation();
			}
		}).one('touchend touchcancel', function(e) {
			$mx(this).off('touchmove');
			slides.removeClass('stop-transition');
			sp.data('is-sliding', null);
			
			if ($mx('.pan-zooming-background').length) {
				$mx('.pan-zooming-background').remove();
				$mx('html').removeClass('is-clipped');
				panZoomObject.remove();
				panZoomObject = null;
			}
			
			if (startDirection != 'y') {
				var time = e.timeStamp - startTime;
				var velocityX = Math.abs(x - startX) / time;
				var direction = (Math.abs(x - startX) > Math.abs(y - startY))?'x':'y';
				var v = 0;
	
				if (velocityX > 0.4 && deltaX != 0 && direction == 'x') {
					deltaX = (deltaX > 0)?55:-55;
				}	
					
				if (deltaX < -50) moveSlide(dots.eq(idx+1), true);
				if (deltaX >  50) moveSlide(dots.eq(idx-1), true);
				if (deltaX < 50 && deltaX > -50) moveSlide(dots.eq(idx), false);
			}
		});
	});
	
	var scrollHandler = function() {
		$mx('.slider-pictures').each(function() {
			var os = $mx(this).offset().top;
			var oh = this.offsetHeight;
			
			var sc = $mx(document).scrollTop();
			var wn = $mx(window).height();

			if ((os - 200 < sc+wn) && (os+oh > sc)) {
				var picture = $mx(this).find('.slider-slide.active .picture-container');
				
				checkPictureSrc(picture);
			}
		});
	}
	
	$mx(document).on('scroll', scrollHandler);
// 	scrollHandler();
	
	$mx.observe('.slider-pictures', function() {
		scrollHandler();
	});
	
	$mx.observe('.slider-pictures[data-interval]', setSliderInterval, function(o) {
		clearInterval(o.attr('data-time'));
	});
});
Storage = {
	get(key, default_value) {
		let result = null;
		
		try {
			if (this.hasStorage()) {
				result = localStorage.getItem(key);
				
				if (result) {
					result = JSON.parse(result);
					
					if (result.expired_at && (result.expired_at < Date.now() / 1000 | 0)) {
						localStorage.removeItem(key);
						return undefined;
					}
					
					result = result.content;
				}
			} 
			
		} catch (e) {
	        result = undefined;
	    }
	    
		if (!result) {
			result = Cookies.get(key);
		}
		
		return result?result:default_value;
	},
	
	set(key, value, expires, path) {
		try {
			if (this.hasStorage()) {
				let obj = { content: value }
				if (expires != undefined) obj.expired_at = (Date.now() / 1000 | 0) + expires; 
				localStorage.setItem(key, JSON.stringify(obj));
			} else {
				Cookies.set(key, value, { expires: expires, path: path?path:'/' });
			}
		} catch (e) { }
	},
	
	hasStorage() {
		return ("localStorage" in window && window.localStorage);
	}
}
/*
	screen 
		- bg
		- gradient
		- picture
		- bg_image
		- color
		- brightness
	avatar
		- color
	link
		- bg
		- color
		- border
		- radius
	bg
		- size: [width, cover, tile]
		- fixed
		- brightness
		- main_color
		
		
	mode:
		page, design, thumb
*/

var globalFontsBase = {'Roboto': 'sans-serif',
					'Lobster': 'cursive',
					'Pacifico': 'cursive',
					'Caveat': 'cursive',
					'Montserrat Alternates': 'sans-serif',
					'Kelly Slab': 'cursive',
					'Pangolin': 'cursive',
					'Oswald': 'sans-serif',
					'Open Sans Condensed': 'sans-serif',
					'Amatic SC': 'cursive',
					'Merriweather': 'serif',
					'Comfortaa': 'cursive',
					'PT Mono': 'monospace',
					'Open Sans': 'sans-serif'
					};

var globalFonts = Object.keys(globalFontsBase);
var globalFontsFallback = [];
for (i in globalFontsBase) globalFontsFallback.push("'"+i+"', "+globalFontsBase[i]);

var StylesFactory = {
	updateCSSBlock(css, parent) {
		if (typeof css != 'string') css = _.map(css, (o) => { return _.values(o).join("\n"); }).join("\n");
		
		const style = document.createElement('style');
	    const txtNode = document.createTextNode(css);
	    
	
	    style.appendChild(txtNode);
	    parent.innerHTML = '';
	    parent.appendChild(style);
	},
	
	addStyle(styles, id, names, css) {
		if (styles[id] == undefined) styles[id] = [];
		styles[id].push(_.map(names?names:[''], (v) => { return '.b-'+id+' '+v}).join(',')+'{'+css.join(';')+'}');
	},
	
	prepareStyles(block_id, name, options, styles) {
		delete styles[block_id];

		if (options.design != undefined && options.design.on) {
			let d = options.design;
			
			switch (name) {
				case 'collapse':
					if (d.color) {
						StylesFactory.addStyle(styles, block_id, ['.collapse-item', '.collapse-item > .a'], ['color:'+d.color+' !important']);
						StylesFactory.addStyle(styles, block_id, ['.collapse-icon:before', '.collapse-icon:after'], ['background:'+d.color+' !important']);
					}
					
					if (d.font) StylesFactory.addStyle(styles, block_id, null, ['font-family: '+globalFontsFallback[d.font]]);
					break;
				case 'break':
					if (d.color) {
						StylesFactory.addStyle(styles, block_id, ['.block-break-inner'], ['color:'+d.color+' !important']);
						StylesFactory.addStyle(styles, block_id, ['.block-break-inner span:before', '.block-break-inner span:after'], ['background-color: '+d.color]);
						StylesFactory.addStyle(styles, block_id, ['.block-break-inner.has-fading span:before'], ['background: linear-gradient(to left, '+d.color+' 0%, rgba(255,255,255,0) 100%)', 'background: -webkit-linear-gradient(right, '+d.color+' 0%,rgba(255,255,255,0) 100%)']);
						StylesFactory.addStyle(styles, block_id, ['.block-break-inner.has-fading span:after'], ['background: linear-gradient(to right, '+d.color+' 0%, rgba(255,255,255,0) 100%)', 'background: -webkit-linear-gradient(left, '+d.color+' 0%,rgba(255,255,255,0) 100%)']);
					}
					break;
			}
		}
	}
}

function hexToRgb(hex) {
	if (!hex) return '255,255,255';
	hex = hex.toString().replace('#', '');
	if (hex.length == 3) hex = hex+hex;
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? (
        parseInt(result[1], 16)+','+
        parseInt(result[2], 16)+','+
        parseInt(result[3], 16)
    ) : '';
}

function buildStylesBackground(theme, part, mode) {
	bg = {};
	let b = theme.bg;
	
	switch (part) {
		case 'html':
			if (b.picture && b.picture.link) {
				bg = {p:'background-position:'+b.position, r:'background-repeat: '+b.repeat+'!important', i:'background-image:url('+b.picture.link+')'};
				
				
				switch (b.type) {
					case 'solid':
						bg.c = 'background-color: '+b.color1+' !important';
						break;
					case 'gradient':
						bg.i += ', linear-gradient('+b.color1+', '+(b.color2?b.color2:b.color1)+')';
						break;
				}
				
				switch (b.size) {
					case 'width':
						bg.s = 'background-size: 100% auto !important';
						break;
					case 'cover':
						bg.s = 'background-size: cover !important';
						break;
					default:
						if (mode == 'thumb') bg.s = 'background-size: 50% !important';
						break;
				}
				
// 				if (b.fixed && (['design', 'thumb'].indexOf(mode) == -1)) bg.a = 'background-attachment: fixed';
			} else {
				 switch (b.type) {
					case 'solid':
						bg.c = 'background-color: '+b.color1+' !important';
						break;
					case 'gradient':
						bg.i = 'background-image:linear-gradient('+b.color1+', '+b.color2+')';
						break;
				}
			}
			
			break;
		case 'body':
			if (b.opacity != 0) {
				if (b.type == 'gradient') {
					bg.i = 'background-image:linear-gradient('+((b.picture && b.picture.link)?('rgba('+hexToRgb(b.color1)+', '+(b.opacity/100)+'), rgba('+hexToRgb(b.color2)+', '+(b.opacity/100)+')'):(b.color1+', '+b.color2))+')';
				} else {
					bg.c = 'background-color: '+((b.picture && b.picture.link)?('rgba('+hexToRgb(b.color1)+', '+(b.opacity/100)+')'):b.color1);
				}
			}
			break;
	}
	
	if (((part == 'html' && mode == 'design') /* || (part == 'body' && mode != 'design') */) && (theme.screen != undefined) && (theme.screen.font != undefined)) {
		let font = globalFonts[theme.screen.font];
		bg.f = "font-family: "+globalFontsFallback[theme.screen.font];

// 		body, button, input, select, textarea
	}
	
				
	return _.values(bg).join(';');
}

function buildStyles(theme, mode) {
	let container = (mode == 'design')?'.page':'html';
	
	
	let s =  [
		'.block-item a, .page a:hover, .block-item a:link, .block-item a:visited, .block-item a:active, .block-item span[href] {color:'+theme.screen.color+'}',
		'.block-break span:before, .block-break span:after {background-color:'+theme.screen.color+'}',
		'.block-break-inner.has-fading span:before {background: linear-gradient(to left, '+theme.screen.color+' 0%, rgba(255,255,255,0) 100%); background: -webkit-linear-gradient(right, '+theme.screen.color+' 0%,rgba(255,255,255,0) 100%);}',
		'.block-break-inner.has-fading span:after {background: linear-gradient(to right, '+theme.screen.color+' 0%, rgba(255,255,255,0) 100%); background: -webkit-linear-gradient(left, '+theme.screen.color+' 0%,rgba(255,255,255,0) 100%);}',
		'.block-item .btn-link, .block-item .btn-link:hover, .block-item .btn-link:link, .block-item .btn-link:active, .block-item .btn-link:visited {background:'+(theme.link.transparent?'transparent':theme.link.bg)+';color:'+theme.link.color+';border-color:'+(/* theme.link.border?theme.link.border: */theme.link.bg)+(theme.link.radius?(';border-radius:'+theme.link.radius):'')+'}',
	];
	
	if (mode != 'design') {
		switch (parseInt(theme.link.hover)) {
			case 1:
				s.push('.btn-link:hover {opacity: 0.9}');
				break;
			case 2:
				s.push('.btn-link {transition: transform .5s cubic-bezier(.2, 2, .2, 1)}');
				s.push('.btn-link:hover {transform: scale(1.02)}');
				break;
		}
	}
	
	if ((mode == 'page' || mode == 'design') && theme.css) {
		s.push(theme.css);
	}
	
	if (theme.link.radius) {
		s.push('.btn-link-style-two, .btn-link-style-arr {;padding-left: 2rem !important;padding-right: 3rem !important; }');
		s.push('.btn-link-style-two:before, .btn-link-style-arr:before { right: 1.5rem }');
	}
	
	if ((mode == 'page') && theme.bg.fixed) {
		container = 'html:before';
		s.push('html:before { content:"";position:fixed;top:0;left:0;width:100%;height:100%;z-index: -2 }');
	}
	
	s.push(container + '{' + buildStylesBackground(theme, 'html', mode) + ' }');
	
	if (mode == 'design') s.push('.page:before { content:""; }');
		
	container = (mode == 'design')?'.page:before':'body';
	
	if ((mode == 'page') && theme.bg.fixed) {
		container = 'html:after';
		s.push('html:after { content:"";position:fixed;top:0;left:0;width:100%;height:100%;z-index: -1 }');
	}
	
	s.push(container + '{' + buildStylesBackground(theme, 'body', mode) + ' }');
	
	if (mode == 'page') {
		if ((theme.screen != undefined) && (theme.screen.font != undefined)) {
			let font = globalFonts[theme.screen.font];
			s.push("body, body button, body input, body select, body textarea {font-family: "+globalFontsFallback[theme.screen.font]+"}");
		}
	}
	
		
	s.push('.page, .block-text a, .block-form .form-field, .block-html a, .collapse-item a, .collapse-item .a, .footer-link, .footer-link:hover, .footer-link:link, .footer-link:visited, .footer-link:active, .product-container-text, .page .label, .flip-clock-label, .page .checkbox:hover, .page  .radio:hover, .collection-bar .button, .page .is-text {color:'+theme.screen.color+' !important}');
	s.push('.flip-clock-dot {background: '+theme.screen.color+'}');
	s.push('.block-text {font-size:2.2em}');
	s.push('.collapse-icon::after, .collapse-icon::before {background:'+theme.screen.color+' !important;}');

	s.push('.block-break:before {border-color: '+theme.screen.color+'}');
	s.push('.text-avatar {color:'+theme.avatar.color+' !important}');
	s.push('.footer-link svg {fill: '+theme.screen.color+' !important}');

	s.push('.block-item .checkbox input:before, .block-item .radio input:before {background:#fff;border-color:#d9d9d9;}');

	let border_checkbox_color = /* theme.link.border?theme.link.border: */theme.link.bg;
	if (theme.link.bg && (border_checkbox_color.toLowerCase() != '#ffffff')) {
		s.push('.block-item .checkbox input:checked:before, .block-item .radio input:checked:before {background:'+(theme.link.transparent?'transparent':theme.link.bg)+';border-color:'+border_checkbox_color+';}');
		s.push('.block-item .checkbox input:after, .block-item .radio input:after {border-color: '+theme.link.color+'}');
	} else {
		s.push('.block-item .checkbox input:after, .block-item .radio input:after {border-color: #333}');
	}


	s.push('.basket-breadcrumbs {border-color:'+(/* theme.link.border?theme.link.border: */theme.link.bg)+'}');
	s.push('.basket-breadcrumbs .button, .basket-breadcrumbs label:after {background:transparent;border-color: '+(theme.link.border?theme.link.border:theme.link.bg)+' !important;color:'+theme.screen.color+'}');
	
	s.push('.basket-breadcrumbs .active, .basket-breadcrumbs label.active:after {background:'+(theme.link.transparent?'transparent':theme.link.bg)+';color:'+(theme.link.bg?theme.link.color:theme.screen.color)+' !important}');

	let border_color_focus = /* (theme.link.border && theme.link.border)?theme.link.border: */theme.link.bg;
	if (border_color_focus.toLowerCase() != '#ffffff') s.push('.block-form input[type="text"]:focus, .block-form input[type="tel"]:focus, .block-form input[type="email"]:focus, .block-form input[type="number"]:focus, .block-form textarea:focus, .block-form .select select:focus, .form-field .pagination-previous:focus, .form-field .pagination-next:focus, .form-field .pagination-link:focus {border-color: '+border_color_focus+' !important;box-shadow: 0 0px 0 1px '+border_color_focus+' !important;}');

	s.push('.select-tap .button {' + (theme.link.bg?('border-color:'+theme.link.bg+' !important'):'') + '}');
	
	s.push('.select-tap .button.in {border-color: '+(/* theme.link.border?theme.link.border: */theme.link.bg)+'!important;background:'+(theme.link.transparent?'transparent':theme.link.bg)+';color:'+theme.link.color+'}');
	 
	s.push('.block-form .datepicker .datepicker-table .datepicker-body .datepicker-row .datepicker-cell.is-selected {background-color: '+(/* theme.link.border?theme.link.border: */theme.link.bg)+'}');
	s.push('.block-form .datepicker .datepicker-table .datepicker-body .datepicker-row .datepicker-cell.is-today {background: whitesmoke;border-color: whitesmoke}');

	if (theme.link.align == 'left') {
		s.push('.btn-link-styled:before {content: "\\f054";}');
		s.push('.btn-link-styled {text-align: left;padding-right: 2.5rem !important;justify-content: start;}');
	}
		
	return s.join("\n");
}
var VideoHelper = {
	matchers: [
		{r: /\.(mp4|m3u8|webm)/, p: 'file'},
		{r: /youtube\.com\/watch\?.*?v=([a-zA-Z0-9\-\_]+)/, p: 'youtube'},
		{r: /youtu\.be\/([a-zA-Z0-9\-\_]+)/, p: 'youtube'},
		{r: /youtube\.com\/embed\/([a-zA-Z0-9\-\_]+)/, p: 'youtube'},
		{r: /vimeo\.com\/(video\/)?([a-zA-Z0-9\-\_]+)/, p: 'vimeo'}
	],
	
	getProviderName: function(src) {
		for (i = 0; i < this.matchers.length; i++) {
			if (m = src.match(this.matchers[i].r)) {
				return this.matchers[i].p;
			}
		}
		
		return null;
	},
	
	getProvider: function(options, isAllowAutoplay) {
		let provider = null;
			
		let providers = {
// 				youtube: {s: '//cdn.jsdelivr.net/npm/videojs-youtube@2.6.1/dist/Youtube.min.js', t: 'video/youtube', techOrder:  ["youtube"]},
			youtube: {embeded: (m) => {
				let params = ['showinfo=0&rel=0&playsinline=0'];
				if (options.is_autoplay && isAllowAutoplay) params.push('autoplay=1&autohide=1');
				if (options.is_autohide) params.push('controls=0&disablekb=1');
				return 'https://www.youtube.com/embed/'+m[1]+'?'+params.join('&');
			}},
			vimeo: {embeded: (m) => {
				let params = [];
				if (options.is_autoplay && isAllowAutoplay) params.push('autoplay=1');
				if (options.is_autohide) params.push('title=0&byline=0&portrait=0');
				return 'https://player.vimeo.com/video/'+m[2]+'?'+params.join('&');
			}},
			file: {s: null, t: (filename) => {
				let formats = {
					'mp4': 'video/mp4',
					'm3u8': 'application/x-mpegURL',
					'webm': 'video/webm'
				}
			}}
		}

		for (i = 0; i < this.matchers.length; i++) {
			if (m = options.url.match(this.matchers[i].r)) {
				provider = providers[this.matchers[i].p];
				provider.match = m;
				break;
			}
		}
		
		return provider;
	}
};