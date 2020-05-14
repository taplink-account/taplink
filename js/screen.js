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
+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $mx.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    //var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

   this.$element.trigger('show.bs.modal', { relatedTarget: _relatedTarget })

//    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = false;//$.support.transition && that.$element.hasClass('fade')
      
      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }
      
      
      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

     // var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

/*
      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          }):
          //.emulateTransitionEnd(300) :
*/
        that.$element.trigger('focus').trigger('shown.bs.modal', { relatedTarget: _relatedTarget })
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

//    e = $.Event('hide.bs.modal')

    this.$element.trigger('hide.bs.modal')

   // if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.$body.removeClass('modal-open')

    this.resetScrollbar()
    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal');
/*

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
*/
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $mx.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = false;//$.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $mx.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback();
      }
/*
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(150) :
*/
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth) return
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $mx.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string' && data[option] != undefined) data[option](_relatedTarget)
      else if (options.show && typeof data.show == 'function') data.show(_relatedTarget)
    })
  }

  var old = $mx.fn.modal

  $mx.fn.modal             = Plugin
  $mx.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $mx.fn.modal.noConflict = function () {
    $mx.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $mx.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
	      alert(1);
        $this.is(':visible') && $this.trigger('focus')
        $target.data('bs.modal', null);
      })
    })
    Plugin.call($target, option, this)
  })

}($mx);

var eventStack = {
	list: {},
	binds: {},
	
	push(part, name) {
		if (this.list[part] == undefined) this.list[part] = [];

		if (this.binds[part] != undefined) {
			_.each(this.binds[part], (cb) => {
				cb(name);
			})
		}
		
		this.list[part].push(name);
/*
		if (this.list[part][name] == undefined) this.list[part][name] = [];
		this.list[part][name].push(func);
*/
	},
	
	bind(part, cb) {
		if (this.binds[part] == undefined) this.binds[part] = [];
		
		if (this.list[part] != undefined) {
			_.each(this.list[part], (v) => {
				cb(v);
			});
		}
		
		this.binds[part].push(cb);
	}
}

var ga = null;

$mx(function() {
	
	var ecommerceEvent = null;
	
	// Отправляет данные в Facebook Pixel о продаже
	var m = document.location.hash.match(/#paid:([a-zA-Z0-9\+\/\\\=]+)/);
	
	if (m) {
		var s = decodeURIComponent(escape(window.atob(m[1]))).split(':');
		var products = [];
		if (s[3] != undefined) products.push({id: s[3], name: (s[4] == undefined)?s[3]:s[4]})
		ecommerceEvent = {type: 'purchase', id: s[0], budget: s[1], currency: s[2], contents: products, content_type: 'product'};
// 		document.location.hash = document.location.hash.replace(/#paid:([a-zA-Z0-9]+)/, '');
// Если затирать #paid меняется hash и форма закрывается
	} else {
		$mx('[data-ecommerce-event]').each(function() {
			let tariffs = _.map(($mx(this).data('ecommerce-event') || '').split(','), (o) => { return {id: o, name: o} });
			ecommerceEvent = {type: 'detail', products: tariffs};
		});
	}
	
		
	var g = $mx('.googleanalytics');
	if (g.length) {
		//$mx(document).on('startup', () => { console.log('=');eventStack.push('google', 'startup'); });

		$mx.lazy('https://www.google-analytics.com/analytics.js', function() {
			var i = 64;
			if (!ga) return;

			g.each(function() {
				i++;
				var name = String.fromCharCode(i);
				var d = $mx(this).data();
				
				var is_customer = $mx(this).is('.googleanalytics-customer');
				
				ga('create', d.id, 'auto', name, is_customer?undefined:d.uid);

				if (d.require != undefined) {
					require = d.require.split(',');
					for (i = 0; i < require.length; i++) {
						ga(name+'.require', require[i]);
					}
				}

				ga(name+'.send', 'pageview');
				
				var hit = function(e, url) {
					ga(name+'.set', 'page', url);
					ga(name+'.send', 'pageview');
				}
				
				//$mx(document).on('ajaxload', hit);
			    if (window.$events != undefined) window.$events.on('navigate', (e, to) => { hit(e, to.path) });
				
				if (is_customer) { 
					$mx($.stat).on('link', (e, o) => {
						if (o.data('addons-googleanalytics-goal')) {
							var ev = o.data('addons-googleanalytics-goal'); 
							ga(name+'.send', 'event', ev.c, ev.a);
						}
					});
					
/*
					$mx(document.body).on('click', '[data-addons-googleanalytics-goal]', function() {
						var ev = $mx(this).data('addons-googleanalytics-goal'); 
						ga(name+'.send', 'event', ev.c, ev.a);
					});
*/
				}
				
				var paidHandler = function(e, p) {
					ga(name+'.require', 'ecommerce');
					ga(name+'.ecommerce:addTransaction', {
						id: p.id,
						affiliation: 'Taplink',
						revenue: p.budget,
						currency: p.currency
					});
					
					ga(name+'.ecommerce:send');
				}
				
				eventStack.bind('google', (eventName) => { ga(name+'.send', 'event', eventName) })
				
				$mx(document).on('paid', paidHandler);
				if (ecommerceEvent && ecommerceEvent.type == 'purchase') paidHandler(null, ecommerceEvent);
				

			});
		});
	}
	
	var m = $mx('.yandexmetrika');
	
	if (m.length) {
		//$mx(document).on('startup', () => { eventStack.push('metrika', 'startup'); });

		(function (doc, w, c, m) {
	    (w[c] = w[c] || []).push(function() {
	       try {
		       var i = 64;
		        m.each(function() {
			        i++;
			        var d = $mx(this).data();
			        d.ecommerce = 'dataLayer_'+String.fromCharCode(i);
			        w[d.ecommerce] = w[d.ecommerce] || [];
			        
/*
			        w['yaCounter'+d.id] = counter = {
				        reachGoal: function(target) {
					        ym(d.id, "reachGoal", target);
				        },
				        
				        hit(url) {
					        ym(d.id, "hit", url);
				        },
				        
				        setUserID(id) {
					        ym(d.id, "setUserID", id);
				        }
					}
					
					console.log(ym);
					console.log(d);
*/
// 					ym(d.id, "init", d);
			        
			        var counter = new Ya.Metrika(d);
			        w['yaCounter'+d.id] = counter;
				    				    
// 			        $mx(document).on('ajaxload', hit);
				    if (w.$events != undefined) w.$events.on('navigate', (e, to) => { counter.hit(to.path); });
				    
				    
				    if ($mx(this).is('.yandexmetrika-customer')) { 
						$mx($.stat).on('link', (e, o) => {
							if (o.data('addons-yandexmetrika-goal')) {
								counter.reachGoal(o.data('addons-yandexmetrika-goal'));
							}
						});
					    
/*
						$mx(document.body).on('click', '[data-addons-yandexmetrika-goal]', function() {
							counter.reachGoal($mx(this).data('addons-yandexmetrika-goal'));
						});
*/
					} else {
						$mx(doc).on('click', '[data-track-event="payment"]', function() {
							counter.reachGoal('payment');
						});
						
						if (w.account != undefined && w.account.profile_id) {
							counter.setUserID(w.account.profile_id);
						}
					}
					
					var paidHandler = function(e, p) {
						var obj = {ecommerce: {}}
						
						if (p.currency != undefined) obj.ecommerce.currencyCode = p.currency;
						
						obj.ecommerce[p.type] = {
							products: p.products
						}
						
						if (p.type == 'purchase') obj['ecommerce'][p.type]['actionField'] = {
							id: p.id,
							revenue: p.budget
						}						
						
						w[d.ecommerce].push(obj);
					}
					
					eventStack.bind('metrika', (name) => { counter.reachGoal(name); })
					
					$mx(document).on('paid', paidHandler);
					if (ecommerceEvent) paidHandler(null, ecommerceEvent);
					
					
// 					$mx(document).on('startup', () => { counter.reachGoal('startup'); });
		        });
	       } catch(e) { }
	    });
	
// 		$mx.lazy("https://mc.yandex.ru/metrika/tag.js");
		$mx.lazy("https://cdn.jsdelivr.net/npm/yandex-metrica-watch/watch.js");
		
// 		})(document, window, "yandex_metrika_callbacks2", m);
		})(document, window, "yandex_metrika_callbacks", m);
		
	}	
	
	var p = $mx('.facebookpixel');
	if (p.length) {
		//$mx(document).on('startup', () => { eventStack.push('facebook', 'startup'); });
		
		!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
		n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
		document,'script','https://connect.facebook.net/en_US/fbevents.js');
				
		p.each(function() { fbq('init', $mx(this).data('id')); });
		fbq('track', 'PageView');
		
		$mx(document).on('click', '[data-track-event="payment"]', function() {
			fbq('track', 'InitiateCheckout');
		});
		
		var hit = function(e, url) {
			fbq('track', 'PageView', {url: url});
		}
		
		var paidHandler = function(e, p) {
			if (window.fbq != undefined) {
// 				try {
					fbq('track', 'Purchase', {value: p.budget, currency: p.currency});
					
// 				} catch(e) { }
			}
		}
		
		eventStack.bind('facebook', (name) => { 
			if (name == 'startup') {
				window.fbq('track', 'CompleteRegistration');
			}
		})
		
		$mx(document)/* .on('ajaxload', hit) */.on('paid', paidHandler);//.on('startup', () => { window.fbq('track', 'CompleteRegistration'); });

		if (ecommerceEvent && ecommerceEvent.type == 'purchase') paidHandler(null, ecommerceEvent);
		
		if (window.$events != undefined) window.$events.on('navigate', (e, to) => { hit(e, to.path) });
	}
	
	
/*
	if ($mx.isset(window.fbq) && m) {
		try {
			var s = decodeURIComponent(escape(window.atob(m[1]))).split(':');
			fbq('track', 'Purchase', {value: s[0], currency: s[1]});
		} catch(e) { }
 		document.location.hash = document.location.hash.replace(/#paid:([a-zA-Z0-9]+)/, '');
	}	
*/
	

});

/*
$mx.fn.caret = function() { return null; }
$mx.keyPreventEnter = function(e) {
	return (e.keyCode != 13);
}
*/

function lightOrDark(color) {
	if (typeof color != 'string') return 'light';
    var r, g, b, hsp;
    
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
    
    hsp = Math.sqrt(
	    0.299 * (r * r) +
	    0.587 * (g * g) +
	    0.114 * (b * b)
    );

	return (hsp > 200)?'light':'dark';
}
			
$mx(function() {
	var $body = $mx(document.body);
	
	function priceRound(v, d) {
		if (d.round == 'floor') v = Math.floor(v);
		if (d.round == 'ceil') v = Math.ceil(v);
		
		if (!isNaN(d.round)) {
			let p = Math.pow(10, d.round)
			v = Math.round(v*p) / p;
		}
		
		return v;
	}
	

	$body.on('click', '.btn-group-tariffs a', function() {
		var o = $mx(this);
		var d = o.data();
		var n = o.closest('nav');
		var dp = n.data();
		$mx('.price-column[data-tariff]').each(function() {
			var column = $mx(this);
			
			var o = column.find('.priceMonthly');
			var t = column.find('.priceTotal');
			
			var base = o.data('price');
			var op = {minimumFractionDigits: dp.decimal, maximumFractionDigits: dp.decimal};
			
			var price = base - (base/100*d.discount);
			if (dp.promotion) {
				old_price = price;
				price = price - (price/100*dp.promotion);
			} else {
				old_price = '';
			}
			
			var price = priceRound(price, dp);
			
			o.find('.new-price span').html(price.toLocaleString(dp.locale, op))
			o.find('.old-price').css('display', (base == price)?'none':'inline');
			
			var prepaid = t.data('prepaid');
			
			t.find('.new-price').html(dp.currencyFormat.replace('%p', '<span style="font-size:2.5rem">'+((price*d.long) - (prepaid?prepaid:0)).toLocaleString(dp.locale, op)+'</span>').replace('%c', dp.currency));
			t.find('.new-price').attr('data-promotion-title', old_price?dp.currencyFormat.replace('%p', (old_price*d.long).toLocaleString(dp.locale, op)).replace('%c', dp.currency):'');

			column.find('.price-total-period').html(d.longText);
			if (prepaid) t.find('.old-price').html('<span>'+((price*d.long)).toLocaleString(dp.locale, op)+'</span>');

			column.find('.linkPromo').attr('href', '/tariffs/promo.html?period='+d.long+'&tariff='+column.data('tariff'));
		});
		
		n.find('li').removeClass('is-active');
		o.parent().addClass('is-active');

		$mx('#inputPeriod').val(d.long);
	}).on('click', '.btn-group-links-statistics .button', function() {
		var d = $mx(this).data();
		var o = $mx('#linksStatisticsData');
		o.load(o.data('url')+'&period='+d.period);
	}).on('click', '.btn-group-statistics .button', function() {
		var d = $mx(this).data();
		var o = $mx('#pageStatisticsData');
		o.load(o.data('url')+'?layout-refresh=1&period='+d.period);
	});
	
	

	$mx('.btn-group-tariffs a[data-long="12"]').click();

	
	$mx.observe('[data-tips-title]', function(o) {
		var d = o.data();
		
		o.attr('title', d.tipsTitle);
		o.removeAttr('data-tips-bit');
		
		var backdrop = $mx('<div class="modal-backdrop fade" />').appendTo(document.body);
		backdrop.addClass('in');
		
		var instance = Tippy(o[0], {
			theme: 'light',
			animateFill: false,
		    trigger: 'manual',
		    hideOnClick: false,
		    interactive: false,
		    arrow: true,
		    popperOptions: {
			    placement: d.tipsPlacement,
			    modifiers: {
					preventOverflow: {
						boundariesElement: 'viewport',
					}
				}
		    }
		});
		
		var popper = instance.getPopperElement(o[0]);
		instance.show(popper);
		
		backdrop.one('click', function() {
			backdrop.removeClass('in');

			if (d.tipsBit) {
				$mx.get('/api/account/updatetipsbits.json?bit='+d.tipsBit);
			}
			
			instance.hide(popper);
			o.removeAttr('title');
			
			setTimeout(() => { backdrop.remove(); }, 150);
			
/*
			backdrop.one('bsTransitionEnd', function () {
				backdrop.remove();
			});//.emulateTransitionEnd(150);
*/
		});
	});
	
	window.initStartup = function(d, cb) {
		//if (window.fbq != undefined) window.fbq('track', 'CompleteRegistration');
		$mx(document).trigger('startup');
		
		$mx.get('/api/account/updatetipsbits.json?bit=2');
		
		var page_holder = $mx('<div class="startup-helper-holder"></div>').appendTo(document.body);
		
		var tips = [
			{selector: '.btn-link-empty', title: d.langNewblock, placement: $mx.touch.isXS?'top':'right'},
			{selector: '.block-avatar img', title: d.langEditblock, placement: 'top'},
			{selector: '.block-handle', title: d.langSort, placement: $mx.touch.isXS?'right':'left'}
// 			{selector: '.form-control-link', title: d.langLink, placement: $.touch.isXS?'bottom':'top'},
		];
		
		var backdrop = $mx('<div class="modal-backdrop fade" />').appendTo(document.body);
		backdrop.addClass('in');
		
		var tips_objects = [];
		var tips_objects_holders = [];
		var tips_instances = [];
		
		function showTip(t) {
			var o = $mx(t.selector).first().attr('title', t.title);
			if (o.length) {
				var offset = o.offset();
				var w = o.outerWidth();
				var h = o.outerHeight();
				var p = $mx('<div></div>').insertAfter(o);//.css({width: w, height: h, 'background': 'red', });
				_.each(['width', 'height', 'margin', 'padding', 'position'], (v) => {
					p.css(v, o.css(v));
				});
				
	// 			$mx('.nobounce').scrollTo(o);
				
				o.css({position: 'absolute', 'z-index': 1050, width: w, height: h, left: offset.left, top: offset.top, 'opacity': 1}).appendTo(page_holder);
				
				tips_objects.push(o);
				tips_objects_holders.push(p);
				

				var instance = Tippy(o[0], {
					theme: 'light',
					animateFill: false,
				    trigger: 'manual',
				    hideOnClick: false,
				    interactive: false,
				    arrow: true,
				    popperOptions: {
					    placement: t.placement,
					    modifiers: {
							preventOverflow: {
								boundariesElement: 'viewport',
							}
						}
				    }
				});
				
				var popper = instance.getPopperElement(o[0]);
				instance.show(popper);
	
				tips_instances.push({i: instance, o:o[0]});

				return true;
			} else {
				return false;
			}
		}	
		
		function closeTip(o, h, t) {
			o.removeAttr('title').css({position: '', top: '', left: '', opacity: '', width: "", height: "", 'z-index': ""}).insertBefore(h);

			var popper = t.i.getPopperElement(t.o);
			t.i.hide(popper);

			h.remove();
		}
		
		function closeTips() {
			backdrop.removeClass('in');
			
			setTimeout(() => {
				backdrop.remove();
				if (cb != undefined) cb();
			}, 150);
			
/*
			backdrop.one('bsTransitionEnd', function () {
				backdrop.remove();
				if (cb != undefined) cb();
			});//.emulateTransitionEnd(150);
*/
			
			for (var i = 0; i < tips_objects.length; i++) {
				closeTip(tips_objects[i], tips_objects_holders[i], tips_instances[i]);
			}
			
			tips_objects = tips_objects_holders = tips_instances = [];
			page_holder.remove();
		}	
	        
		if ($mx.touch.isXS) {
			var i = 0;
			
			function showNextTips() {
				if (tips_objects.length) closeTip(tips_objects[0], tips_objects_holders[0], tips_instances[0]);
				tips_objects = [];
				tips_objects_holders = [];
				tips_instances = [];
				
				if (i == tips.length) {
					closeTips()
				} else {
					if (showTip(tips[i])) {
						backdrop.one('click', showNextTips);
						i++;
					} else {
						i++;
						showNextTips();
					}
				}
			}
			
			showNextTips();
		} else {
			for (var i = 0; i < tips.length; i++) {
				showTip(tips[i]);
			}
		
			backdrop.one('click', closeTips);
		}
	}
	
/*
	$mx(function() {
		$mx.observe('.trial-init', function(o) {
			o.removeClass('modal-hide').addClass($.touch.isXS?'downup':'zoom').modal('show').one('hidden.bs.modal', function() {
				o.addClass('modal-hide');
			});
		});
	});
*/

	/*
$body.on('click', '.projects-menu', function(e) {
		if ($mx(e.target).closest('ul').length) return;
		$mx(this).toggleClass('in');
		e.preventDefault();
		e.stopPropagation();
	}).on('click', function() {
		if (!$mx(this).closest('.projects-menu').length) $mx('.projects-menu:not(.lock)').removeClass('in');
	}).on('click', 'form[data-filter-place] input[name="id[]"]', function() {
		var form = $mx(this).closest('form');
		$mx(form.data('filter-place')).toggleClass('disabled', !form.find('input[name="id[]"]:checked').length);
	})
*/
	$body.on('click', '.index-counter-more', function() {
		var o = $mx(this);
		var page = o.data('page')+1;
		o.data('page', page);
		
		$mx.get(o.data('prefix')+'/examples/get.json?page='+page).then(function(r) {
			var pages = $mx('.counter-page');
			let s = r.data;
			for (var i = 0; i < s.length; i++) {
				pages.eq(i).attr('src', '//taplink.cc/'+s[i].nickname+'?static=1');
			}
		});
	}).on('click', '.index-container-welcome .btn-group-tariffs .button', function(e) { //, .index-welcome-device
		var o = $mx(this).parent();
		var hero = o.closest('.hero-block');
		
		var devices = hero.find('.marvel-device');
		
		var device = devices.removeClass('in').eq(o.index());
		var video = device.addClass('in').find('video');
		if (video.length) video[0].currentTime = 0;
		
		var buttons = hero.find('.btn-group-gray .button');
		buttons.removeClass('active').eq(o.index()).addClass('active');
		
		
	});
});

$mx.observe('video', function(o) {
	o.removeAttr('controls');
});


$mx.observe('[data-blink]', function(o) {
	let cb = () => {
		o.addClass('active');
		setTimeout(() => {
			let s = o.text();
			let b = o.data('blink');
			o.text(b);
			o.data('blink', s);
			o.removeClass('active');
		}, 300);
	}
	
	let interval = setInterval(cb, 4000);
	o.attr('interval', interval);
}, function(o) {
	clearInterval(o.attr('interval'));
});


/*
function authCheck(r) {
	if (r && r.result == 'success') document.location = '/login/auth.html?uid='+r.uid+'&session='+r.session+'&redirect='+encodeURIComponent(document.location.href);
}
*/

function changeLocaleApp(e) {
	e.preventDefault();
	let o = $mx(e.target);
	let d = o.data();
	
	if (d.currentLocale == d.lang) return;
	
	let href = document.location.href;
	let is_dev = href.indexOf('dev.') != -1;
	
	href = href.substr(document.location.origin.length);
	
	if (window.base_path_prefix) {
		href = href.substr(window.base_path_prefix.length);
	}
	
	var c = Cookies.get();
	
	var url = '//'+(is_dev?'dev.':'')+'taplink.'+d.zone+(d.multilanguage?('/'+d.lang):'')+'/system/changelanguage.html?lang='+d.lang+'&redirect='+encodeURIComponent((d.multilanguage?('/'+d.lang):'')+href);

	if (c.uid) url += '&uid='+c.uid;
	if (c.session) url += '&session='+c.session;
	document.location.href = url;
}

function changeLocale(e, o, zone, lang, multilanguage, prefix) {
	e.preventDefault();
	
	var c = Cookies.get();
	
	var url = '//'+prefix+'taplink.'+zone+(multilanguage?('/'+lang):'')+'/system/changelanguage.html?lang='+lang+'&redirect='+encodeURIComponent(o.href);

	if (c.uid) url += '&uid='+c.uid;
	if (c.session) url += '&session='+c.session;
	document.location.href = url;
}

function hideLocaleMessage(o, lang) {
	$mx.get('/system/setlanguagecookie.html', {lang: lang});
	o.closest('.message').remove();
}

$mx(function() {
	$mx(document.body).on('click', '.cookie-banner button', function(e) {
		let o = $mx(this);
		o.closest('.cookie-banner').addClass('is-closed');
		Cookies.set('cookie_privacy', 1);
		setTimeout(function() {
			o.remove();
		}, 1000);
	});

	$mx.observe('.cookie-banner', function() {
		var oldScrolled = window.pageYOffset || document.documentElement.scrollTop;
		
		var eventScroll = function() {
			var scrolled = window.pageYOffset || document.documentElement.scrollTop;
			if (Math.abs(scrolled - oldScrolled) > 1024) {
				$mx('.cookie-banner button').click();
				$mx(window).off('scroll', eventScroll);
			}
		}
		
		$mx(window).on('scroll', eventScroll);
	})

	
	window.addEventListener("touchmove", function(event) {
		if (event.scale != undefined && event.scale !== 1) event.preventDefault();
	}, { passive: false });
});

/**!
* (c) 2017 atomiks (Tippy) & FezVrasta (Popper)
* @file tippy.js (popper.js 1.9.9 included) | Pure JS Tooltip Library
* @version 0.16.1
* @license MIT
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Tippy = factory());
}(this, (function () { 'use strict';

var nativeHints = ['native code', '[object MutationObserverConstructor]'];

/**
 * Determine if a function is implemented natively (as opposed to a polyfill).
 * @method
 * @memberof Popper.Utils
 * @argument {Function | undefined} fn the function to check
 * @returns {Boolean}
 */
var isNative = (function (fn) {
  return nativeHints.some(function (hint) {
    return (fn || '').toString().indexOf(hint) > -1;
  });
});

var isBrowser = typeof window !== 'undefined';
var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var scheduled = false;
  var i = 0;
  var elem = document.createElement('span');

  // MutationObserver provides a mechanism for scheduling microtasks, which
  // are scheduled *before* the next task. This gives us a way to debounce
  // a function but ensure it's called *before* the next paint.
  var observer = new MutationObserver(function () {
    fn();
    scheduled = false;
  });

  observer.observe(elem, { attributes: true });

  return function () {
    if (!scheduled) {
      scheduled = true;
      elem.setAttribute('x-index', i);
      i = i + 1; // don't use compund (+=) because it doesn't get optimized in V8
    }
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

// It's common for MutationObserver polyfills to be seen in the wild, however
// these rely on Mutation Events which only occur when an element is connected
// to the DOM. The algorithm used in this module does not use a connected element,
// and so we must ensure that a *native* MutationObserver is available.
var supportsNativeMutationObserver = isBrowser && isNative(window.MutationObserver);

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsNativeMutationObserver ? microtaskDebounce : taskDebounce;

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element || ['HTML', 'BODY', '#document'].indexOf(element.nodeName) !== -1) {
    return window.document.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || element.firstElementChild.offsetParent === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  // NOTE: 1 DOM access here
  var offsetParent = element && element.offsetParent;
  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return window.document.documentElement;
  }

  return offsetParent;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return window.document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = window.document.documentElement;
    var scrollingElement = window.document.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return +styles['border' + sideA + 'Width'].split('px')[0] + +styles['border' + sideB + 'Width'].split('px')[0];
}

/**
 * Tells if you are running Internet Explorer 10
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean} isIE10
 */
var isIE10 = undefined;

var isIE10$1 = function () {
  if (isIE10 === undefined) {
    isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
  }
  return isIE10;
};

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], html['client' + axis], html['offset' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = window.document.body;
  var html = window.document.documentElement;
  var computedStyle = isIE10$1() && window.getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  if (isIE10$1()) {
    try {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } catch (err) {}
  } else {
    rect = element.getBoundingClientRect();
  }

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var isIE10 = isIE10$1();
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top,
    left: childrenRect.left - parentRect.left,
    width: childrenRect.width,
    height: childrenRect.height
  });

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (isHTML || parent.nodeName === 'BODY') {
    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = isIE10 && isHTML ? 0 : +styles.borderTopWidth.split('px')[0];
    var borderLeftWidth = isIE10 && isHTML ? 0 : +styles.borderLeftWidth.split('px')[0];
    var marginTop = isIE10 && isHTML ? 0 : +styles.marginTop.split('px')[0];
    var marginLeft = isIE10 && isHTML ? 0 : +styles.marginLeft.split('px')[0];

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var html = window.document.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = getScroll(html);
  var scrollLeft = getScroll(html, 'left');

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  // NOTE: 1 DOM access here
  var boundaries = { top: 0, left: 0 };
  var offsetParent = findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(popper));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = window.document.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = window.document.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var commonOffsetParent = findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find$1(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find$1(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier.function) {
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier.function || modifier.fn;
    if (modifier.enabled && isFunction(fn)) {
      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'webkit', 'moz', 'o'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length - 1; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof window.document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.left = '';
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? window : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  window.addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  window.removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    window.cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data, options) {
  // apply the final offsets to the popper
  // NOTE: 1 DOM access here
  var styles = {
    position: data.offsets.popper.position
  };

  var attributes = {
    'x-placement': data.placement
  };

  // round top and left to avoid blurry text
  var left = Math.round(data.offsets.popper.left);
  var top = Math.round(data.offsets.popper.top);

  // if gpuAcceleration is set to true and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');
  if (options.gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles.top = 0;
    styles.left = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `left` and `top` properties
    styles.left = left;
    styles.top = top;
    styles.willChange = 'top, left';
  }

  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, _extends({}, styles, data.styles));

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, _extends({}, attributes, data.attributes));

  // if the arrow style has been computed, apply the arrow style
  if (data.offsets.arrow) {
    setStyles(data.arrowElement, data.offsets.arrow);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);
  return options;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find$1(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var popper = getClientRect(data.offsets.popper);
  var reference = data.offsets.reference;
  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var side = isVertical ? 'top' : 'left';
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  var sideValue = center - getClientRect(data.offsets.popper)[side];

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = {};
  data.offsets.arrow[side] = Math.round(sideValue);
  data.offsets.arrow[altSide] = ''; // make sure to unset any eventual altSide value from the DOM node

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = getClientRect(data.offsets.popper);
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var popper = getClientRect(data.offsets.popper);
  var reference = data.offsets.reference;
  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find$1(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);
  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
  options.boundaries = boundaries;

  var order = options.priority;
  var popper = getClientRect(data.offsets.popper);

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var reference = data.offsets.reference;
    var popper = getClientRect(data.offsets.popper);
    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find$1(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var popper = getClientRect(data.offsets.popper);
  var reference = getClientRect(data.offsets.reference);
  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[placement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} priority=['left', 'right', 'top', 'bottom']
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var DEFAULTS$1 = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [DEFAULTS](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference.jquery ? reference[0] : reference;
    this.popper = popper.jquery ? popper[0] : popper;

    // make sure to apply the popper position before any computation
    setStyles(this.popper, { position: 'absolute' });

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * @static
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = DEFAULTS$1;

var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends$1 = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**!
* @file tippy.js | Pure JS Tooltip Library
* @version 0.16.1
* @license MIT
*/

// Unsupported: IE<=9, Opera Mini
var IS_UNSUPPORTED_BROWSER = typeof window !== 'undefined' && (!('addEventListener' in window) || /MSIE 9/i.test(navigator.userAgent) || typeof window.operamini !== 'undefined');

var STORE = [];

var DEFAULTS = !IS_UNSUPPORTED_BROWSER && Object.freeze({
    html: false,
    position: 'top',
    animation: 'shift',
    animateFill: true,
    arrow: false,
    arrowSize: 'regular',
    delay: 0,
    hideDelay: 0,
    trigger: 'mouseenter focus',
    duration: 375,
    hideDuration: 375,
    interactive: false,
    interactiveBorder: 2,
    theme: 'dark',
    size: 'regular',
    distance: 10,
    offset: 0,
    hideOnClick: true,
    multiple: false,
    followCursor: false,
    inertia: false,
    flipDuration: 300,
    sticky: false,
    stickyDuration: 200,
    appendTo: typeof document !== 'undefined' ? document.body : null,
    zIndex: 9999,
    popperOptions: {}
});

var DEFAULTS_KEYS = !IS_UNSUPPORTED_BROWSER && Object.keys(DEFAULTS);

var SELECTORS = {
    popper: '.tippy-popper',
    tooltip: '.tippy-tooltip',
    content: '.tippy-tooltip-content',
    circle: '[x-circle]',
    arrow: '[x-arrow]',
    el: '[data-tooltipped]',
    controller: '[data-tippy-controller]'
};

// Hook events only if rendered on a browser
if (!(typeof window === 'undefined' || typeof document === 'undefined')) {
    if (!IS_UNSUPPORTED_BROWSER) {
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('touchstart', handleDocumentTouchstart);
    }
}

var touchDevice = false;
var idCounter = 1;

function handleDocumentTouchstart(event) {
    touchDevice = true;

    // iOS needs cursor:pointer on elements which are non-clickable in order
    // to register both clicks and mouseenter events
    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream) {
        document.body.classList.add('tippy-touch');
    }

    document.removeEventListener('touchstart', handleDocumentTouchstart);
}

// Handle clicks anywhere on the document
function handleDocumentClick(event) {

    var el = closest(event.target, SELECTORS.el);
    var popper = closest(event.target, SELECTORS.popper);

    if (popper) {
        var ref = find(STORE, function (ref) {
            return ref.popper === popper;
        });
        var interactive = ref.settings.interactive;

        if (interactive) return;
    }

    if (el) {
        var _ref = find(STORE, function (ref) {
            return ref.el === el;
        });
        var _popper = _ref.popper,
            _ref$settings = _ref.settings,
            hideOnClick = _ref$settings.hideOnClick,
            multiple = _ref$settings.multiple,
            trigger = _ref$settings.trigger;

        // If they clicked before the show() was to fire, clear it

        if (hideOnClick === true && !touchDevice) {
            clearTimeout(_popper.getAttribute('data-delay'));
        }

        // Hide all poppers except the one belonging to the element that was clicked IF
        // `multiple` is false AND they are a touch user, OR
        // `multiple` is false AND it's triggered by a click
        if (!multiple && touchDevice || !multiple && trigger.indexOf('click') !== -1) {
            return hideAllPoppers(_ref);
        }

        // If hideOnClick is not strictly true or triggered by a click don't hide poppers
        if (hideOnClick !== true || trigger.indexOf('click') !== -1) return;
    }

    // Don't trigger a hide for tippy controllers, and don't needlessly run loop
    if (closest(event.target, SELECTORS.controller) || !document.querySelector(SELECTORS.popper)) return;

    hideAllPoppers();
}

/**
* Returns the supported prefixed property - only `webkit` is needed, `moz`, `ms` and `o` are obsolete
* @param {String} property
* @return {String} - browser supported prefixed property
*/
function prefix(property) {
    var prefixes = [false, 'webkit'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
        var _prefix = prefixes[i];
        var prefixedProp = _prefix ? '' + _prefix + upperProp : property;
        if (typeof window.document.body.style[prefixedProp] !== 'undefined') {
            return prefixedProp;
        }
    }

    return null;
}

/**
* Returns the non-shifted placement (e.g., 'bottom-start' => 'bottom')
* @param {String} placement
* @return {String}
*/
function getCorePlacement(placement) {
    return placement.replace(/-.+/, '');
}

/**
* Polyfill to get the closest parent element
* @param {Element} element - child of parent to be returned
* @param {String} parentSelector - selector to match the parent if found
* @return {Element}
*/
function closest(element, parentSelector) {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
    }
    if (!Element.prototype.closest) Element.prototype.closest = function (selector) {
        var el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };
    return element.closest(parentSelector);
}

/**
* Polyfill for Array.prototype.find
* @param {Array} arr
* @param {Function} checkFn
* @return item in the array
*/
function find(arr, checkFn) {
    if (Array.prototype.find) {
        return arr.find(checkFn);
    }

    // use `filter` as fallback
    return arr.filter(checkFn)[0];
}

/**
* Creates a new popper instance
* @param {Object} ref
* @return {Object} - the popper instance
*/
function createPopperInstance(ref) {
    var el = ref.el,
        popper = ref.popper,
        _ref$settings2 = ref.settings,
        position = _ref$settings2.position,
        popperOptions = _ref$settings2.popperOptions,
        offset = _ref$settings2.offset,
        distance = _ref$settings2.distance;


    var tooltip = popper.querySelector(SELECTORS.tooltip);

    var config = _extends$1({
        placement: position
    }, popperOptions || {}, {
        modifiers: _extends$1({}, popperOptions ? popperOptions.modifiers : {}, {
            flip: _extends$1({
                padding: distance + 5 /* 5px from viewport boundary */
            }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.flip : {}),
            offset: _extends$1({
                offset: offset
            }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.offset : {})
        }),
        onUpdate: function onUpdate() {
            tooltip.style.top = '';
            tooltip.style.bottom = '';
            tooltip.style.left = '';
            tooltip.style.right = '';
            tooltip.style[getCorePlacement(popper.getAttribute('x-placement'))] = -(distance - DEFAULTS.distance) + 'px';
        }
    });

    return new Popper(el, popper, config);
}

/**
* Creates a popper element then returns it
* @param {Number} id - the popper id
* @param {String} title - the tooltip's `title` attribute
* @param {Object} settings - individual settings
* @return {Element} - the popper element
*/
function createPopperElement(id, title, settings) {
    var position = settings.position,
        distance = settings.distance,
        arrow = settings.arrow,
        animateFill = settings.animateFill,
        inertia = settings.inertia,
        animation = settings.animation,
        arrowSize = settings.arrowSize,
        size = settings.size,
        theme = settings.theme,
        html = settings.html,
        zIndex = settings.zIndex;


    var popper = document.createElement('div');
    popper.setAttribute('class', 'tippy-popper');
    popper.setAttribute('role', 'tooltip');
    popper.setAttribute('aria-hidden', 'true');
    popper.setAttribute('id', 'tippy-tooltip-' + id);
    popper.style.zIndex = zIndex;

    var tooltip = document.createElement('div');
    tooltip.setAttribute('class', 'tippy-tooltip tippy-tooltip--' + size + ' ' + theme + '-theme leave');
    tooltip.setAttribute('data-animation', animation);

    if (arrow) {
        // Add an arrow
        var _arrow = document.createElement('div');
        _arrow.setAttribute('class', 'arrow-' + arrowSize);
        _arrow.setAttribute('x-arrow', '');
        tooltip.appendChild(_arrow);
    }

    if (animateFill) {
        // Create animateFill circle element for animation
        tooltip.setAttribute('data-animatefill', '');
        var circle = document.createElement('div');
        circle.setAttribute('class', 'leave');
        circle.setAttribute('x-circle', '');
        tooltip.appendChild(circle);
    }

    if (inertia) {
        // Change transition timing function cubic bezier
        tooltip.setAttribute('data-inertia', '');
    }

    // Tooltip content (text or HTML)
    var content = document.createElement('div');
    content.setAttribute('class', 'tippy-tooltip-content');

    if (html) {

        var templateId = void 0;

        if (html instanceof Element) {
            content.innerHTML = html.innerHTML;
            templateId = html.id || 'tippy-html-template';
        } else {
            content.innerHTML = document.getElementById(html.replace('#', '')).innerHTML;
            templateId = html;
        }

        popper.classList.add('html-template');
        popper.setAttribute('tabindex', '0');
        tooltip.setAttribute('data-template-id', templateId);
    } else {
        content.innerHTML = title;
    }

    // Init distance. Further updates are made in the popper instance's `onUpdate()` method
    tooltip.style[getCorePlacement(position)] = -(distance - DEFAULTS.distance) + 'px';

    tooltip.appendChild(content);
    popper.appendChild(tooltip);

    return popper;
}

/**
* Creates a trigger
* @param {Object} event - the custom event specified in the `trigger` setting
* @param {Element} el - tooltipped element
* @param {Object} handlers - the handlers for each listener
* @return {Array} - array of listener objects
*/
function createTrigger(event, el, handlers) {
    var listeners = [];

    if (event === 'manual') return listeners;

    // Enter
    el.addEventListener(event, handlers.handleTrigger);
    listeners.push({
        event: event,
        handler: handlers.handleTrigger
    });

    // Leave
    if (event === 'mouseenter') {
        el.addEventListener('mouseleave', handlers.handleMouseleave);
        listeners.push({
            event: 'mouseleave',
            handler: handlers.handleMouseleave
        });
    }
    if (event === 'focus') {
        el.addEventListener('blur', handlers.handleBlur);
        listeners.push({
            event: 'blur',
            handler: handlers.handleBlur
        });
    }

    return listeners;
}

/**
* Adds each reference (tooltipped element, popper and its settings/listeners etc)
* into global storage
* @param {Object} ref - current ref in the forEach loop to be pushed
*/
function pushIntoStorage(ref) {
    STORE.push(ref);
}

/**
* Removes the title from the tooltipped element
* @param {Element} el
*/
function removeTitle(el) {
    var title = el.title;
    el.setAttribute('data-original-title', title || 'html');
    el.removeAttribute('title');
}

/**
* Determines if an element is visible in the viewport
* @param {Element} el
* @return {Boolean}
*/
function elementIsInViewport(el) {
    var rect = el.getBoundingClientRect();

    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

/**
* Mousemove event listener callback method for follow cursor setting
* @param {Event} e
*/
function followCursorHandler(e) {
    var _this = this;

    var ref = find(STORE, function (ref) {
        return ref.el === _this;
    });
    var popper = ref.popper;


    var position = getCorePlacement(popper.getAttribute('x-placement'));
    var halfPopperWidth = Math.round(popper.offsetWidth / 2);
    var halfPopperHeight = Math.round(popper.offsetHeight / 2);
    var viewportPadding = 5;
    var pageWidth = document.documentElement.offsetWidth || document.body.offsetWidth;

    var pageX = e.pageX,
        pageY = e.pageY;


    var x = void 0,
        y = void 0;

    if (position === 'top') {
        x = pageX - halfPopperWidth;
        y = pageY - 2.5 * halfPopperHeight;
    } else if (position === 'left') {
        x = pageX - 2 * halfPopperWidth - 15;
        y = pageY - halfPopperHeight;
    } else if (position === 'right') {
        x = pageX + halfPopperHeight;
        y = pageY - halfPopperHeight;
    } else if (position === 'bottom') {
        x = pageX - halfPopperWidth;
        y = pageY + halfPopperHeight / 1.5;
    }

    // Prevent left/right overflow
    if (position === 'top' || position === 'bottom') {
        if (pageX + viewportPadding + halfPopperWidth > pageWidth) {
            // Right overflow
            x = pageWidth - viewportPadding - 2 * halfPopperWidth;
        } else if (pageX - viewportPadding - halfPopperWidth < 0) {
            // Left overflow
            x = viewportPadding;
        }
    }

    popper.style[prefix('transform')] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
}

/**
* Triggers a document repaint or reflow for CSS transition
* @param {Element} tooltip
* @param {Element} circle
*/
function triggerReflow(tooltip, circle) {
    // Safari needs the specific 'transform' property to be accessed
    circle ? window.getComputedStyle(circle)[prefix('transform')] : window.getComputedStyle(tooltip).opacity;
}

/**
* Modifies elements' class lists
* @param {Array} els - HTML elements
* @param {Function} callback
*/
function modifyClassList(els, callback) {
    els.forEach(function (el) {
        if (!el) return;
        callback(el.classList);
    });
}

/**
* Applies the transition duration to each element
* @param {Array} els - HTML elements
* @param {Number} duration
*/
function applyTransitionDuration(els, duration) {
    var mutableDuration = duration;

    els.forEach(function (el) {
        if (!el) return;

        mutableDuration = duration;

        // Circle fill should be a bit quicker
        if (el.hasAttribute('x-circle')) {
            mutableDuration = Math.round(mutableDuration / 1.2);
        }

        el.style[prefix('transitionDuration')] = mutableDuration + 'ms';
    });
}

/**
* Prepares the callback functions for `show` and `hide` methods
* @param {Object} ref -  the element/popper reference
* @param {Number} duration
* @param {Function} callback - callback function to fire once transitions complete
*/
function onTransitionEnd(ref, duration, callback) {

    var tooltip = ref.popper.querySelector(SELECTORS.tooltip);
    var transitionendFired = false;

    var listenerCallback = function listenerCallback(e) {
        if (e.target !== tooltip) return;

        transitionendFired = true;

        tooltip.removeEventListener('webkitTransitionEnd', listenerCallback);
        tooltip.removeEventListener('transitionend', listenerCallback);

        callback();
    };

    // Wait for transitions to complete
    tooltip.addEventListener('webkitTransitionEnd', listenerCallback);
    tooltip.addEventListener('transitionend', listenerCallback);

    // transitionend listener sometimes may not fire
    clearTimeout(ref.transitionendTimeout);
    ref.transitionendTimeout = setTimeout(function () {
        !transitionendFired && callback();
    }, duration);
}

/**
* @param {Element} popper
* @param {String} type 'show'/'hide'
* @return {Boolean}
*/
function isExpectedState(popper, type) {
    return popper.style.visibility === type;
}

/**
* Appends the popper and creates a popper instance if one does not exist
* Also updates its position if need be and enables event listeners
* @param {Object} ref -  the element/popper reference
*/
function mountPopper(ref) {
    var el = ref.el,
        popper = ref.popper,
        _ref$settings3 = ref.settings,
        appendTo = _ref$settings3.appendTo,
        followCursor = _ref$settings3.followCursor;


    appendTo.appendChild(ref.popper);

    if (!ref.popperInstance) {
        // Create instance if it hasn't been created yet
        ref.popperInstance = createPopperInstance(ref);

        // Follow cursor setting
        if (followCursor && !touchDevice) {
            el.addEventListener('mousemove', followCursorHandler);
            ref.popperInstance.disableEventListeners();
        }
    } else {
        ref.popperInstance.update();
        !followCursor && ref.popperInstance.enableEventListeners();
    }
}

/**
* Pushes execution of a function to end of execution queue, doing so
* just before repaint if possible
* @return {Function}
*     @param {Function} fn
*/
var queueExecution = function () {
    var currentTimeoutQueue = void 0;

    return function (fn) {
        clearTimeout(currentTimeoutQueue);

        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(function () {
                currentTimeoutQueue = setTimeout(fn, 0);
            });
        } else {
            currentTimeoutQueue = setTimeout(fn, 0);
        }
    };
}();

/**
* Updates a popper's position on each animation frame to make it stick to a moving element
* @param {Object} ref
*/
function makeSticky(ref) {
    var popper = ref.popper,
        popperInstance = ref.popperInstance,
        stickyDuration = ref.settings.stickyDuration;


    var applyTransitionDuration = function applyTransitionDuration() {
        return popper.style[prefix('transitionDuration')] = stickyDuration + 'ms';
    };

    var removeTransitionDuration = function removeTransitionDuration() {
        return popper.style[prefix('transitionDuration')] = '';
    };

    var updatePosition = function updatePosition() {
        popperInstance && popperInstance.scheduleUpdate();

        applyTransitionDuration();

        var isVisible = popper.style.visibility === 'visible';

        if (window.requestAnimationFrame) {
            isVisible ? window.requestAnimationFrame(updatePosition) : removeTransitionDuration();
        } else {
            isVisible ? setTimeout(updatePosition, 20) : removeTransitionDuration();
        }
    };

    // Wait until Popper's position has been updated initially
    queueExecution(updatePosition);
}

/**
* Hides all poppers
* @param {Object} currentRef
*/
function hideAllPoppers(currentRef) {

    STORE.forEach(function (ref) {
        var popper = ref.popper,
            tippyInstance = ref.tippyInstance,
            _ref$settings4 = ref.settings,
            appendTo = _ref$settings4.appendTo,
            hideOnClick = _ref$settings4.hideOnClick,
            hideDuration = _ref$settings4.hideDuration,
            trigger = _ref$settings4.trigger;

        // Don't hide already hidden ones

        if (!appendTo.contains(popper)) return;

        // hideOnClick can have the truthy value of 'persistent', so strict check is needed
        var isHideOnClick = hideOnClick === true || trigger.indexOf('focus') !== -1;
        var isNotCurrentRef = !currentRef || popper !== currentRef.popper;

        if (isHideOnClick && isNotCurrentRef) {
            tippyInstance.hide(popper, hideDuration);
        }
    });
}

/**
* Returns an array of elements based on the selector input
* @param {String|Element} selector
* @return {Array} of HTML Elements
*/
function getSelectorElementsArray(selector) {
    if (selector instanceof Element) {
        return [selector];
    }

    return [].slice.call(document.querySelectorAll(selector));
}

/**
* Determines if the mouse's cursor is outside the interactive border
* @param {MouseEvent} event
* @param {Element} popper
* @param {Object} settings
* @return {Boolean}
*/
function cursorIsOutsideInteractiveBorder(event, popper, settings) {
    if (!popper.getAttribute('x-placement')) return false;

    var x = event.clientX,
        y = event.clientY;
    var interactiveBorder = settings.interactiveBorder,
        distance = settings.distance;


    var rect = popper.getBoundingClientRect();
    var corePosition = getCorePlacement(popper.getAttribute('x-placement'));
    var borderWithDistance = interactiveBorder + distance;

    var exceedsTop = rect.top - y > interactiveBorder;
    var exceedsBottom = y - rect.bottom > interactiveBorder;
    var exceedsLeft = rect.left - x > interactiveBorder;
    var exceedsRight = x - rect.right > interactiveBorder;

    if (corePosition === 'top') {
        exceedsTop = rect.top - y > borderWithDistance;
    } else if (corePosition === 'bottom') {
        exceedsBottom = y - rect.bottom > borderWithDistance;
    } else if (corePosition === 'left') {
        exceedsLeft = rect.left - x > borderWithDistance;
    } else if (corePosition === 'right') {
        exceedsRight = x - rect.right > borderWithDistance;
    }

    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
}

/**
* Private methods are prefixed with an underscore _
* @param {String|Element} selector
* @param {Object} settings (optional) - the object of settings to be applied to the instance
*/

var Tippy$1 = function () {
    function Tippy(selector) {
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck$1(this, Tippy);


        // Use default browser tooltip on unsupported browsers.
        if (IS_UNSUPPORTED_BROWSER) return;

        this.selector = selector;
        this.settings = Object.freeze(_extends$1({}, DEFAULTS, settings));
        this.callbacks = {
            wait: settings.wait,
            beforeShown: settings.beforeShown || new Function(),
            shown: settings.shown || new Function(),
            beforeHidden: settings.beforeHidden || new Function(),
            hidden: settings.hidden || new Function()
        };

        var els = getSelectorElementsArray(selector);
        this._createTooltips(els);
    }

    /**
    * Returns an object of settings to override global settings
    * @param {Element} el - the tooltipped element
    * @return {Object} - individual settings
    */


    createClass$1(Tippy, [{
        key: '_applyIndividualSettings',
        value: function _applyIndividualSettings(el) {
            var _this2 = this;

            var settings = {};

            DEFAULTS_KEYS.forEach(function (key) {
                var val = el.getAttribute('data-' + key.toLowerCase()) || _this2.settings[key];

                // Convert strings to booleans
                if (val === 'false') {
                    val = false;
                } else if (val === 'true') {
                    val = true;
                }
                // Convert number strings to true numbers
                if (!isNaN(parseFloat(val))) {
                    val = parseFloat(val);
                }

                settings[key] = val;
            });

            // animateFill is disabled if an arrow is true
            if (settings.arrow) {
                settings.animateFill = false;
            }

            return _extends$1({}, this.settings, settings);
        }

        /**
        * Returns relevant listener callbacks for each ref
        * @param {Element} el
        * @param {Element} popper
        * @param {Object} settings
        * @return {Object} - relevant listener callback methods
        */

    }, {
        key: '_getEventListenerHandlers',
        value: function _getEventListenerHandlers(el, popper, settings) {
            var _this3 = this;

            var position = settings.position,
                delay = settings.delay,
                hideDelay = settings.hideDelay,
                hideDuration = settings.hideDuration,
                duration = settings.duration,
                interactive = settings.interactive,
                interactiveBorder = settings.interactiveBorder,
                distance = settings.distance,
                hideOnClick = settings.hideOnClick,
                trigger = settings.trigger;


            var clearTimeouts = function clearTimeouts() {
                clearTimeout(popper.getAttribute('data-delay'));
                clearTimeout(popper.getAttribute('data-hidedelay'));
            };

            var _show = function _show() {
                clearTimeouts();

                // Already visible. For clicking when it also has a `focus` event listener
                if (popper.style.visibility === 'visible') return;

                if (delay) {
                    var timeout = setTimeout(function () {
                        return _this3.show(popper, duration);
                    }, delay);
                    popper.setAttribute('data-delay', timeout);
                } else {
                    _this3.show(popper, duration);
                }
            };

            var show = function show(event) {
                return _this3.callbacks.wait ? _this3.callbacks.wait.call(popper, _show, event) : _show();
            };

            var hide = function hide() {
                clearTimeouts();

                if (hideDelay) {
                    var timeout = setTimeout(function () {
                        return _this3.hide(popper, hideDuration);
                    }, hideDelay);
                    popper.setAttribute('data-hidedelay', timeout);
                } else {
                    _this3.hide(popper, hideDuration);
                }
            };

            var handleTrigger = function handleTrigger(event) {
                // Toggle show/hide when clicking click-triggered tooltips
                var isClick = event.type === 'click';
                var isVisible = popper.style.visibility === 'visible';
                var isNotPersistent = hideOnClick !== 'persistent';

                isClick && isVisible && isNotPersistent ? hide() : show(event);
            };

            var handleMouseleave = function handleMouseleave(event) {

                if (interactive) {
                    // Temporarily handle mousemove to check if the mouse left somewhere
                    // other than its popper
                    var handleMousemove = function handleMousemove(event) {
                        var triggerHide = function triggerHide() {
                            document.removeEventListener('mousemove', handleMousemove);
                            hide();
                        };

                        var closestTooltippedEl = closest(event.target, SELECTORS.el);

                        var isOverPopper = closest(event.target, SELECTORS.popper) === popper;
                        var isOverEl = closestTooltippedEl === el;
                        var isClickTriggered = trigger.indexOf('click') !== -1;
                        var isOverOtherTooltippedEl = closestTooltippedEl && closestTooltippedEl !== el;

                        if (isOverOtherTooltippedEl) {
                            return triggerHide();
                        }

                        if (isOverPopper || isOverEl || isClickTriggered) return;

                        if (cursorIsOutsideInteractiveBorder(event, popper, settings)) {
                            triggerHide();
                        }
                    };
                    return document.addEventListener('mousemove', handleMousemove);
                }

                // If it's not interactive, just hide it
                hide();
            };

            var handleBlur = function handleBlur(event) {
                // Only hide if not a touch user and has a focus 'relatedtarget', of which is not
                // a popper element
                if (touchDevice || !event.relatedTarget) return;
                if (closest(event.relatedTarget, SELECTORS.popper)) return;

                hide();
            };

            return {
                handleTrigger: handleTrigger,
                handleMouseleave: handleMouseleave,
                handleBlur: handleBlur
            };
        }

        /**
        * Creates tooltips for all elements that match the instance's selector
        * @param {Array} els - Elements
        */

    }, {
        key: '_createTooltips',
        value: function _createTooltips(els) {
            var _this4 = this;

            els.forEach(function (el) {
                var settings = _this4._applyIndividualSettings(el);

                // If the script is in the <head> then document.body will be null
                settings.appendTo = settings.appendTo || document.body;

                var html = settings.html,
                    trigger = settings.trigger;


                var title = el.title;
                if (!title && !html) return;

                var id = idCounter;
                el.setAttribute('data-tooltipped', '');
               // el.setAttribute('aria-describedby', 'tippy-tooltip-' + id);

                removeTitle(el);

                var popper = createPopperElement(id, title, settings);
                var handlers = _this4._getEventListenerHandlers(el, popper, settings);
                var listeners = [];

                trigger.trim().split(' ').forEach(function (event) {
                    return listeners = listeners.concat(createTrigger(event, el, handlers));
                });

                pushIntoStorage({
                    id: id,
                    el: el,
                    popper: popper,
                    settings: settings,
                    listeners: listeners,
                    tippyInstance: _this4
                });

                idCounter++;
            });

            Tippy.store = STORE; // Allow others to access `STORE` if need be
        }

        /**
        * Returns a tooltipped element's popper reference
        * @param {Element} el
        * @return {Element}
        */

    }, {
        key: 'getPopperElement',
        value: function getPopperElement(el) {
            try {
                return find(STORE, function (ref) {
                    return ref.el === el;
                }).popper;
            } catch (e) {
                throw new Error('[Tippy error]: Element does not exist in any Tippy instances');
            }
        }

        /**
        * Returns a popper's tooltipped element reference
        * @param {Element} popper
        * @return {Element}
        */

    }, {
        key: 'getTooltippedElement',
        value: function getTooltippedElement(popper) {
            try {
                return find(STORE, function (ref) {
                    return ref.popper === popper;
                }).el;
            } catch (e) {
                throw new Error('[Tippy error]: Popper does not exist in any Tippy instances');
            }
        }

        /**
        * Returns the reference object from either the tooltipped element or popper element
        * @param {Element} x (tooltipped element or popper)
        * @return {Object}
        */

    }, {
        key: 'getReference',
        value: function getReference(x) {
            return find(STORE, function (ref) {
                return ref.el === x;
            }) || find(STORE, function (ref) {
                return ref.popper === x;
            });
        }

        /**
        * Shows a popper
        * @param {Element} popper
        * @param {Number} duration (optional)
        */

    }, {
        key: 'show',
        value: function show(popper) {
            var _this5 = this;

            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.settings.duration;


            this.callbacks.beforeShown.call(popper);

            var ref = find(STORE, function (ref) {
                return ref.popper === popper;
            });
            var tooltip = popper.querySelector(SELECTORS.tooltip);
            var circle = popper.querySelector(SELECTORS.circle);

            var el = ref.el,
                _ref$settings5 = ref.settings,
                appendTo = _ref$settings5.appendTo,
                sticky = _ref$settings5.sticky,
                interactive = _ref$settings5.interactive,
                followCursor = _ref$settings5.followCursor,
                flipDuration = _ref$settings5.flipDuration;

            // Remove transition duration (prevent a transition when popper changes posiiton)

            applyTransitionDuration([popper, tooltip, circle], 0);

            // Mount popper to DOM if its container does not have it
            !appendTo.contains(popper) && mountPopper(ref);

            popper.style.visibility = 'visible';
            popper.setAttribute('aria-hidden', 'false');

            var onceUpdated = function onceUpdated() {
                if (!isExpectedState(popper, 'visible')) return;

                // Sometimes the arrow will not be in the correct position,
                // force another update
                !followCursor && ref.popperInstance.update();

                // Re-apply transition durations
                applyTransitionDuration([tooltip, circle], duration);
                !followCursor && applyTransitionDuration([popper], flipDuration);

                // Interactive tooltips receive a class of 'active'
                interactive && el.classList.add('active');

                // Update popper's position on every animation frame
                sticky && makeSticky(ref);

                // Repaint/reflow is required for CSS transition when appending
                triggerReflow(tooltip, circle);

                modifyClassList([tooltip, circle], function (list) {
                    list.contains('tippy-notransition') && list.remove('tippy-notransition');
                    list.remove('leave');
                    list.add('enter');
                });

                // Wait for transitions to complete
                onTransitionEnd(ref, duration, function () {
                    if (!isExpectedState(popper, 'visible') || ref.onShownFired) return;

                    // Focus interactive tooltips only
                    interactive && popper.focus();

                    // Remove transitions from tooltip
                    tooltip.classList.add('tippy-notransition');

                    // Prevents shown() from firing more than once from early transition cancellations
                    ref.onShownFired = true;

                    _this5.callbacks.shown.call(popper);
                });
            };

            // Wait for popper to update position and alter x-placement
            queueExecution(onceUpdated);
        }

        /**
        * Hides a popper
        * @param {Element} popper
        * @param {Number} duration (optional)
        */

    }, {
        key: 'hide',
        value: function hide(popper) {
            var _this6 = this;

            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.settings.duration;


            this.callbacks.beforeHidden.call(popper);

            var ref = find(STORE, function (ref) {
                return ref.popper === popper;
            });
            var tooltip = popper.querySelector(SELECTORS.tooltip);
            var circle = popper.querySelector(SELECTORS.circle);
            var content = popper.querySelector(SELECTORS.content);

            var el = ref.el,
                _ref$settings6 = ref.settings,
                appendTo = _ref$settings6.appendTo,
                sticky = _ref$settings6.sticky,
                interactive = _ref$settings6.interactive,
                followCursor = _ref$settings6.followCursor,
                html = _ref$settings6.html,
                trigger = _ref$settings6.trigger;


            ref.onShownFired = false;
            interactive && el.classList.remove('active');

            popper.style.visibility = 'hidden';
            popper.setAttribute('aria-hidden', 'true');

            // Use same duration as show if it's the default
            if (duration === DEFAULTS.hideDuration) {
                duration = parseInt(tooltip.style[prefix('transitionDuration')]);
            } else {
                applyTransitionDuration([tooltip, circle], duration);
            }

            modifyClassList([tooltip, circle], function (list) {
                list.contains('tippy-tooltip') && list.remove('tippy-notransition');
                list.remove('enter');
                list.add('leave');
            });

            // Re-focus click-triggered html elements
            // and the tooltipped element IS in the viewport (otherwise it causes unsightly scrolling
            // if the tooltip is closed and the element isn't in the viewport anymore)
            if (html && trigger.indexOf('click') !== -1 && elementIsInViewport(el)) {
                el.focus();
            }

            // Wait for transitions to complete
            onTransitionEnd(ref, duration, function () {
                if (!isExpectedState(popper, 'hidden') || !appendTo.contains(popper)) return;

                ref.popperInstance.disableEventListeners();

                appendTo.removeChild(popper);

                _this6.callbacks.hidden.call(popper);
            });
        }

        /**
        * Destroys a popper
        * @param {Element} popper
        */

    }, {
        key: 'destroy',
        value: function destroy(popper) {
            var ref = find(STORE, function (ref) {
                return ref.popper === popper;
            });
            var el = ref.el,
                popperInstance = ref.popperInstance,
                listeners = ref.listeners;

            // Ensure the popper is hidden

            if (!isExpectedState(popper, 'hidden')) {
                this.hide(popper, 0);
            }

            // Remove Tippy-only event listeners from tooltipped element
            listeners.forEach(function (listener) {
                return el.removeEventListener(listener.event, listener.handler);
            });

            el.removeAttribute('data-tooltipped');
            el.removeAttribute('aria-describedby');

            popperInstance && popperInstance.destroy();

            // Remove from storage
            STORE.splice(STORE.map(function (ref) {
                return ref.popper;
            }).indexOf(popper), 1);
        }

        /**
        * Updates a popper with new content
        * @param {Element} popper
        */

    }, {
        key: 'update',
        value: function update(popper) {
            var ref = find(STORE, function (ref) {
                return ref.popper === popper;
            });
            var content = popper.querySelector(SELECTORS.content);
            var el = ref.el,
                html = ref.settings.html;


            if (html) {
                content.innerHTML = html instanceof Element ? html.innerHTML : document.getElementById(html.replace('#', '')).innerHTML;
            } else {
                content.innerHTML = el.title || el.getAttribute('data-original-title');
                removeTitle(el);
            }
        }
    }]);
    return Tippy;
}();

function factory(selector, settings) {
    return new Tippy$1(selector, settings);
}

return factory;

})));

$mx(function() {
	$mx.observe('[data-toggle="tooltip"]', function(o) {
		var d = o.data();
		o.attr('title', d.originalTitle);
		
		var instance = Tippy(o[0], {
		    position: d.placement,
		    arrow: true,
		    trigger: (d.trigger != undefined)?((d.trigger == 'show')?'manual':d.trigger):'mouseenter focus',
// 		    hideOnClick: false,
		    popperOptions: {
			    modifiers: {
					preventOverflow: {
						boundariesElement: (d.boundariesElement == undefined)?'viewport':d.boundariesElement,
						enabled: true
					}
				}
		    },
		    zIndex: 99999
		});
		
		if (d.trigger == 'show') {	
			var popper = instance.getPopperElement(o[0]);
			instance.show(popper);
		}
		
		o.data('popper', instance);
	});

/*
	$mx(document.body).on('modal.hide modal.show', function() {
		$('[data-toggle="tooltip"]').each(function(o) {
			var instance = this._tippy;
			
			if (instance && instance.state.visible) {
				instance.popperInstance.disableEventListeners()
				instance.hide()
			}
		});
	
	});
*/
});
$mx(document).ready(function() {
	// TODO: remove при перегрузки страницы
	$mx('body').append('<div style="position:absolute;top:-1000px"><div id="autoResizeTextareaCopy" style="white-space:pre-wrap;box-sizing: border-box; -moz-box-sizing: border-box;  -ms-box-sizing: border-box; -webkit-box-sizing: border-box; visibility: hidden;"></div></div>');
	var $copy = $mx('#autoResizeTextareaCopy');
	
	function autoSize($textarea, options) { 
		// The copy must have the same padding, the same dimentions and the same police than the original.
		$copy.css({
			fontFamily:     $textarea.css('fontFamily'),
			fontSize:       $textarea.css('fontSize'),
			lineHeight:     $textarea.css('lineHeight'),
			padding:        $textarea.css('padding'),
			paddingLeft:    $textarea.css('paddingLeft'),
			paddingRight:   $textarea.css('paddingRight'),
			paddingTop:     $textarea.css('paddingTop'), 
			paddingBottom:  $textarea.css('paddingBottom'), 
			width:          $textarea.css('width')
		});
		$textarea.css('overflow', 'hidden');
		$textarea.parents('.media').find('.pull-left.hide').removeClass('is-hidden');
		
		// Copy textarea contents; browser will calculate correct height of copy.
		var text = $textarea.val().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
		$copy.html(text + '<br />');
		
		// Then, we get the height of the copy and we apply it to the textarea.
		var newHeight = $copy.outerHeight();
		//$copy.html(''); // We do this because otherwise, a large void appears in the page if the textarea has a high height.
		if(parseInt(newHeight) != 0) {
			if((options.maxHeight != null && parseInt(newHeight) < parseInt(options.maxHeight)) || options.maxHeight == null) {
				$textarea.css('height', Math.max(options.minHeight, newHeight));
				$textarea.css('overflow-y', 'hidden');
			}
			else {
				$textarea.css('overflow-y', 'scroll');
			}
		}
	}
	
	$mx.fn.autoResize = function(options) { 
		var $this = $mx(this),
		    defaultOptions = {
				maxHeight:  null,
				minHeight:	($this.attr('rows') == undefined || $this.attr('rows') == 1)?40:$this.height()
			};
		
		options = (options == undefined) ? {} : options;
		options = $mx.extend(true, defaultOptions, options);
		$this.on('keyup keydown keypress change paste input cut paste focus', function() { autoSize($this, options); } );

		autoSize($this, options);
	};
});


$mx.observe("textarea.autoresize-init", function(o) {
	o.autoResize();
});

/*!
  hey, [be]Lazy.js - v1.8.2 - 2016.10.25
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
;
(function(root, blazy) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register bLazy as an anonymous module
        define(blazy);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = blazy();
    } else {
        // Browser globals. Register bLazy on window
        root.Blazy = blazy();
    }
})(this, function() {
    'use strict';

    //private vars
    var _source, _viewport, _isRetina, _supportClosest, _attrSrc = 'src', _attrSrcset = 'srcset';

    // constructor
    return function Blazy(options) {
        //IE7- fallback for missing querySelectorAll support
        if (!document.querySelectorAll) {
            var s = document.createStyleSheet();
            document.querySelectorAll = function(r, c, i, j, a) {
                a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
                for (i = r.length; i--;) {
                    s.addRule(r[i], 'k:v');
                    for (j = a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
                    s.removeRule(0);
                }
                return c;
            };
        }

        //options and helper vars
        var scope = this;
        var util = scope._util = {};
        util.elements = [];
        util.destroyed = true;
        scope.options = options || {};
        scope.options.error = scope.options.error || false;
        scope.options.offset = scope.options.offset || 100;
        scope.options.root = scope.options.root || document;
        scope.options.success = scope.options.success || false;
        scope.options.selector = scope.options.selector || '.b-lazy';
        scope.options.separator = scope.options.separator || '|';
        scope.options.containerClass = scope.options.container;
        scope.options.container = scope.options.containerClass ? document.querySelectorAll(scope.options.containerClass) : false;
        scope.options.errorClass = scope.options.errorClass || 'b-error';
        scope.options.breakpoints = scope.options.breakpoints || false;
        scope.options.loadInvisible = scope.options.loadInvisible || false;
        scope.options.successClass = scope.options.successClass || 'b-loaded';
        scope.options.validateDelay = scope.options.validateDelay || 25;
        scope.options.saveViewportOffsetDelay = scope.options.saveViewportOffsetDelay || 50;
        scope.options.srcset = scope.options.srcset || 'data-srcset';
        scope.options.src = _source = scope.options.src || 'data-src';
        _supportClosest = Element.prototype.closest;
        _isRetina = window.devicePixelRatio > 1;
        _viewport = {};
        _viewport.top = 0 - scope.options.offset;
        _viewport.left = 0 - scope.options.offset;


        /* public functions
         ************************************/
        scope.revalidate = function() {
            initialize(scope);
        };
        scope.load = function(elements, force) {
            var opt = this.options;
            if (elements && elements.length === undefined) {
                loadElement(elements, force, opt);
            } else {
                each(elements, function(element) {
                    loadElement(element, force, opt);
                });
            }
        };
        scope.destroy = function() {            
            var util = scope._util;
            if (scope.options.container) {
                each(scope.options.container, function(object) {
                    unbindEvent(object, 'scroll', util.validateT);
                });
            }
            unbindEvent(window, 'scroll', util.validateT);
            unbindEvent(window, 'resize', util.validateT);
            unbindEvent(window, 'resize', util.saveViewportOffsetT);
            util.count = 0;
            util.elements.length = 0;
            util.destroyed = true;
        };

        //throttle, ensures that we don't call the functions too often
        util.validateT = throttle(function() {
            validate(scope);
        }, scope.options.validateDelay, scope);
        util.saveViewportOffsetT = throttle(function() {
            saveViewportOffset(scope.options.offset);
        }, scope.options.saveViewportOffsetDelay, scope);
        saveViewportOffset(scope.options.offset);

        //handle multi-served image src (obsolete)
        each(scope.options.breakpoints, function(object) {
            if (object.width >= window.screen.width) {
                _source = object.src;
                return false;
            }
        });

        // start lazy load
        setTimeout(function() {
            initialize(scope);
        }); // "dom ready" fix

    };


    /* Private helper functions
     ************************************/
    function initialize(self) {
        var util = self._util;
        // First we create an array of elements to lazy load
        util.elements = toArray(self.options);
        util.count = util.elements.length;
        // Then we bind resize and scroll events if not already binded
        if (util.destroyed) {
            util.destroyed = false;
            if (self.options.container) {
                each(self.options.container, function(object) {
                    bindEvent(object, 'scroll', util.validateT);
                });
            }
            bindEvent(window, 'resize', util.saveViewportOffsetT);
            bindEvent(window, 'resize', util.validateT);
            bindEvent(window, 'scroll', util.validateT);
        }
        // And finally, we start to lazy load.
        validate(self);
    }

    function validate(self) {
        var util = self._util;
        for (var i = 0; i < util.count; i++) {
            var element = util.elements[i];
            if (elementInView(element, self.options) || hasClass(element, self.options.successClass)) {
                self.load(element);
                util.elements.splice(i, 1);
                util.count--;
                i--;
            }
        }
        if (util.count === 0) {
            self.destroy();
        }
    }

    function elementInView(ele, options) {
        var rect = ele.getBoundingClientRect();

        if(options.container && _supportClosest){
            // Is element inside a container?
            var elementContainer = ele.closest(options.containerClass);
            if(elementContainer){
                var containerRect = elementContainer.getBoundingClientRect();
                // Is container in view?
                if(inView(containerRect, _viewport)){
                    var top = containerRect.top - options.offset;
                    var right = containerRect.right + options.offset;
                    var bottom = containerRect.bottom + options.offset;
                    var left = containerRect.left - options.offset;
                    var containerRectWithOffset = {
                        top: top > _viewport.top ? top : _viewport.top,
                        right: right < _viewport.right ? right : _viewport.right,
                        bottom: bottom < _viewport.bottom ? bottom : _viewport.bottom,
                        left: left > _viewport.left ? left : _viewport.left
                    };
                    // Is element in view of container?
                    return inView(rect, containerRectWithOffset);
                } else {
                    return false;
                }
            }
        }      
        return inView(rect, _viewport);
    }

    function inView(rect, viewport){
        // Intersection
        return rect.right >= viewport.left &&
               rect.bottom >= viewport.top && 
               rect.left <= viewport.right && 
               rect.top <= viewport.bottom;
    }

    function loadElement(ele, force, options) {
        // if element is visible, not loaded or forced
        if (!hasClass(ele, options.successClass) && (force || options.loadInvisible || (ele.offsetWidth > 0 && ele.offsetHeight > 0))) {
            var dataSrc = getAttr(ele, _source) || getAttr(ele, options.src); // fallback to default 'data-src'
            if (dataSrc) {
                var dataSrcSplitted = dataSrc.split(options.separator);
                var src = dataSrcSplitted[_isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
                var srcset = getAttr(ele, options.srcset);
                var isImage = equal(ele, 'img');
                var parent = ele.parentNode;
                var isPicture = parent && equal(parent, 'picture');
                // Image or background image
                if (isImage || ele.src === undefined) {
                    var img = new Image();
                    // using EventListener instead of onerror and onload
                    // due to bug introduced in chrome v50 
                    // (https://productforums.google.com/forum/#!topic/chrome/p51Lk7vnP2o)
                    var onErrorHandler = function() {
                        if (options.error) options.error(ele, "invalid");
                        addClass(ele, options.errorClass);
                        unbindEvent(img, 'error', onErrorHandler);
                        unbindEvent(img, 'load', onLoadHandler);
                    };
                    var onLoadHandler = function() {
                        // Is element an image
                        if (isImage) {
                            if(!isPicture) {
                                handleSources(ele, src, srcset);
                            }
                        // or background-image
                        } else {
                            ele.style.backgroundImage = 'url("' + src + '")';
                        }
                        itemLoaded(ele, options);
                        unbindEvent(img, 'load', onLoadHandler);
                        unbindEvent(img, 'error', onErrorHandler);
                    };
                    
                    // Picture element
                    if (isPicture) {
                        img = ele; // Image tag inside picture element wont get preloaded
                        each(parent.getElementsByTagName('source'), function(source) {
                            handleSource(source, _attrSrcset, options.srcset);
                        });
                    }
                    bindEvent(img, 'error', onErrorHandler);
                    bindEvent(img, 'load', onLoadHandler);
                    handleSources(img, src, srcset); // Preload

                } else { // An item with src like iframe, unity games, simpel video etc
                    ele.src = src;
                    itemLoaded(ele, options);
                }
            } else {
                // video with child source
                if (equal(ele, 'video')) {
                    each(ele.getElementsByTagName('source'), function(source) {
                        handleSource(source, _attrSrc, options.src);
                    });
                    ele.load();
                    itemLoaded(ele, options);
                } else {
                    if (options.error) options.error(ele, "missing");
                    addClass(ele, options.errorClass);
                }
            }
        }
    }

    function itemLoaded(ele, options) {
        addClass(ele, options.successClass);
        if (options.success) options.success(ele);
        // cleanup markup, remove data source attributes
        removeAttr(ele, options.src);
        removeAttr(ele, options.srcset);
        each(options.breakpoints, function(object) {
            removeAttr(ele, object.src);
        });
    }

    function handleSource(ele, attr, dataAttr) {
        var dataSrc = getAttr(ele, dataAttr);
        if (dataSrc) {
            setAttr(ele, attr, dataSrc);
            removeAttr(ele, dataAttr);
        }
    }

    function handleSources(ele, src, srcset){
        if(srcset) {
            setAttr(ele, _attrSrcset, srcset); //srcset
        }
        ele.src = src; //src 
    }

    function setAttr(ele, attr, value){
        ele.setAttribute(attr, value);
    }

    function getAttr(ele, attr) {
        return ele.getAttribute(attr);
    }

    function removeAttr(ele, attr){
        ele.removeAttribute(attr); 
    }

    function equal(ele, str) {
        return ele.nodeName.toLowerCase() === str;
    }

    function hasClass(ele, className) {
        return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }

    function addClass(ele, className) {
        if (!hasClass(ele, className)) {
            ele.className += ' ' + className;
        }
    }

    function toArray(options) {
        var array = [];
        var nodelist = (options.root).querySelectorAll(options.selector);
        for (var i = nodelist.length; i--; array.unshift(nodelist[i])) {}
        return array;
    }

    function saveViewportOffset(offset) {
        _viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + offset;
        _viewport.right = (window.innerWidth || document.documentElement.clientWidth) + offset;
    }

    function bindEvent(ele, type, fn) {
        if (ele.attachEvent) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
        } else {
            ele.addEventListener(type, fn, { capture: false, passive: true });
        }
    }

    function unbindEvent(ele, type, fn) {
        if (ele.detachEvent) {
            ele.detachEvent && ele.detachEvent('on' + type, fn);
        } else {
            ele.removeEventListener(type, fn, { capture: false, passive: true });
        }
    }

    function each(object, fn) {
        if (object && fn) {
            var l = object.length;
            for (var i = 0; i < l && fn(object[i], i) !== false; i++) {}
        }
    }

    function throttle(fn, minDelay, scope) {
        var lastCall = 0;
        return function() {
            var now = +new Date();
            if (now - lastCall < minDelay) {
                return;
            }
            lastCall = now;
            fn.apply(scope, arguments);
        };
    }
});
$mx(function() {
    var bLazy = new Blazy({loadInvisible: false, selector: '.lazy', 'src': 'data-lazy-src'});
});
/*! Pickr 1.4.7 MIT | https://github.com/Simonwep/pickr */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Pickr=e():t.Pickr=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=134)}([function(t,e,r){var n=r(3),o=r(17).f,i=r(8),a=r(15),c=r(39),u=r(66),s=r(71);t.exports=function(t,e){var r,l,f,p,v,h=t.target,d=t.global,g=t.stat;if(r=d?n:g?n[h]||c(h,{}):(n[h]||{}).prototype)for(l in e){if(p=e[l],f=t.noTargetGet?(v=o(r,l))&&v.value:r[l],!s(d?l:h+(g?".":"#")+l,t.forced)&&void 0!==f){if(typeof p==typeof f)continue;u(p,f)}(t.sham||f&&f.sham)&&i(p,"sham",!0),a(r,l,p,t)}}},function(t,e,r){var n=r(3),o=r(20),i=r(40),a=r(72),c=n.Symbol,u=o("wks");t.exports=function(t){return u[t]||(u[t]=a&&c[t]||(a?c:i)("Symbol."+t))}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,r){(function(e){var r=function(t){return t&&t.Math==Math&&t};t.exports=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof e&&e)||Function("return this")()}).call(this,r(98))},function(t,e,r){var n=r(5);t.exports=function(t){if(!n(t))throw TypeError(String(t)+" is not an object");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){var r={}.hasOwnProperty;t.exports=function(t,e){return r.call(t,e)}},function(t,e,r){var n=r(2);t.exports=!n((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,e,r){var n=r(7),o=r(12),i=r(18);t.exports=n?function(t,e,r){return o.f(t,e,i(1,r))}:function(t,e,r){return t[e]=r,t}},function(t,e,r){var n=r(16),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},function(t,e,r){var n=r(26),o=r(11);t.exports=function(t){return n(o(t))}},function(t,e){t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},function(t,e,r){var n=r(7),o=r(63),i=r(4),a=r(19),c=Object.defineProperty;e.f=n?c:function(t,e,r){if(i(t),e=a(e,!0),i(r),o)try{return c(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},function(t,e,r){var n=r(11);t.exports=function(t){return Object(n(t))}},function(t,e){var r={}.toString;t.exports=function(t){return r.call(t).slice(8,-1)}},function(t,e,r){var n=r(3),o=r(20),i=r(8),a=r(6),c=r(39),u=r(65),s=r(28),l=s.get,f=s.enforce,p=String(u).split("toString");o("inspectSource",(function(t){return u.call(t)})),(t.exports=function(t,e,r,o){var u=!!o&&!!o.unsafe,s=!!o&&!!o.enumerable,l=!!o&&!!o.noTargetGet;"function"==typeof r&&("string"!=typeof e||a(r,"name")||i(r,"name",e),f(r).source=p.join("string"==typeof e?e:"")),t!==n?(u?!l&&t[e]&&(s=!0):delete t[e],s?t[e]=r:i(t,e,r)):s?t[e]=r:c(e,r)})(Function.prototype,"toString",(function(){return"function"==typeof this&&l(this).source||u.call(this)}))},function(t,e){var r=Math.ceil,n=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?n:r)(t)}},function(t,e,r){var n=r(7),o=r(38),i=r(18),a=r(10),c=r(19),u=r(6),s=r(63),l=Object.getOwnPropertyDescriptor;e.f=n?l:function(t,e){if(t=a(t),e=c(e,!0),s)try{return l(t,e)}catch(t){}if(u(t,e))return i(!o.f.call(t,e),t[e])}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,r){var n=r(5);t.exports=function(t,e){if(!n(t))return t;var r,o;if(e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!n(o=r.call(t)))return o;if(!e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e,r){var n=r(27),o=r(99);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.3.6",mode:n?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,e,r){var n=r(75),o=r(26),i=r(13),a=r(9),c=r(46),u=[].push,s=function(t){var e=1==t,r=2==t,s=3==t,l=4==t,f=6==t,p=5==t||f;return function(v,h,d,g){for(var y,b,m=i(v),x=o(m),w=n(h,d,3),S=a(x.length),_=0,A=g||c,O=e?A(v,S):r?A(v,0):void 0;S>_;_++)if((p||_ in x)&&(b=w(y=x[_],_,m),t))if(e)O[_]=b;else if(b)switch(t){case 3:return!0;case 5:return y;case 6:return _;case 2:u.call(O,y)}else if(l)return!1;return f?-1:s||l?l:O}};t.exports={forEach:s(0),map:s(1),filter:s(2),some:s(3),every:s(4),find:s(5),findIndex:s(6)}},function(t,e,r){"use strict";var n=r(19),o=r(12),i=r(18);t.exports=function(t,e,r){var a=n(e);a in t?o.f(t,a,i(0,r)):t[a]=r}},function(t,e,r){var n=r(2),o=r(1),i=r(77),a=o("species");t.exports=function(t){return i>=51||!n((function(){var e=[];return(e.constructor={})[a]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},function(t,e){t.exports={}},function(t,e,r){var n=r(15),o=r(111),i=Object.prototype;o!==i.toString&&n(i,"toString",o,{unsafe:!0})},function(t,e,r){var n=r(2),o=r(14),i="".split;t.exports=n((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?i.call(t,""):Object(t)}:Object},function(t,e){t.exports=!1},function(t,e,r){var n,o,i,a=r(100),c=r(3),u=r(5),s=r(8),l=r(6),f=r(29),p=r(30),v=c.WeakMap;if(a){var h=new v,d=h.get,g=h.has,y=h.set;n=function(t,e){return y.call(h,t,e),e},o=function(t){return d.call(h,t)||{}},i=function(t){return g.call(h,t)}}else{var b=f("state");p[b]=!0,n=function(t,e){return s(t,b,e),e},o=function(t){return l(t,b)?t[b]:{}},i=function(t){return l(t,b)}}t.exports={set:n,get:o,has:i,enforce:function(t){return i(t)?o(t):n(t,{})},getterFor:function(t){return function(e){var r;if(!u(e)||(r=o(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}}},function(t,e,r){var n=r(20),o=r(40),i=n("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},function(t,e){t.exports={}},function(t,e,r){var n=r(69),o=r(43).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,o)}},function(t,e,r){var n=r(14);t.exports=Array.isArray||function(t){return"Array"==n(t)}},function(t,e,r){var n=r(4),o=r(101),i=r(43),a=r(30),c=r(102),u=r(64),s=r(29)("IE_PROTO"),l=function(){},f=function(){var t,e=u("iframe"),r=i.length;for(e.style.display="none",c.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),f=t.F;r--;)delete f.prototype[i[r]];return f()};t.exports=Object.create||function(t,e){var r;return null!==t?(l.prototype=n(t),r=new l,l.prototype=null,r[s]=t):r=f(),void 0===e?r:o(r,e)},a[s]=!0},function(t,e,r){var n=r(69),o=r(43);t.exports=Object.keys||function(t){return n(t,o)}},function(t,e,r){"use strict";var n=r(10),o=r(50),i=r(24),a=r(28),c=r(80),u=a.set,s=a.getterFor("Array Iterator");t.exports=c(Array,"Array",(function(t,e){u(this,{type:"Array Iterator",target:n(t),index:0,kind:e})}),(function(){var t=s(this),e=t.target,r=t.kind,n=t.index++;return!e||n>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:e[n],done:!1}:{value:[n,e[n]],done:!1}}),"values"),i.Arguments=i.Array,o("keys"),o("values"),o("entries")},function(t,e,r){"use strict";var n=r(7),o=r(3),i=r(71),a=r(15),c=r(6),u=r(14),s=r(109),l=r(19),f=r(2),p=r(33),v=r(31).f,h=r(17).f,d=r(12).f,g=r(84).trim,y=o.Number,b=y.prototype,m="Number"==u(p(b)),x=function(t){var e,r,n,o,i,a,c,u,s=l(t,!1);if("string"==typeof s&&s.length>2)if(43===(e=(s=g(s)).charCodeAt(0))||45===e){if(88===(r=s.charCodeAt(2))||120===r)return NaN}else if(48===e){switch(s.charCodeAt(1)){case 66:case 98:n=2,o=49;break;case 79:case 111:n=8,o=55;break;default:return+s}for(a=(i=s.slice(2)).length,c=0;c<a;c++)if((u=i.charCodeAt(c))<48||u>o)return NaN;return parseInt(i,n)}return+s};if(i("Number",!y(" 0o1")||!y("0b1")||y("+0x1"))){for(var w,S=function(t){var e=arguments.length<1?0:t,r=this;return r instanceof S&&(m?f((function(){b.valueOf.call(r)})):"Number"!=u(r))?s(new y(x(e)),r,S):x(e)},_=n?v(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),A=0;_.length>A;A++)c(y,w=_[A])&&!c(S,w)&&d(S,w,h(y,w));S.prototype=b,b.constructor=S,a(o,"Number",S)}},function(t,e,r){"use strict";var n=r(0),o=r(3),i=r(27),a=r(7),c=r(72),u=r(2),s=r(6),l=r(32),f=r(5),p=r(4),v=r(13),h=r(10),d=r(19),g=r(18),y=r(33),b=r(34),m=r(31),x=r(103),w=r(44),S=r(17),_=r(12),A=r(38),O=r(8),j=r(15),k=r(20),E=r(29),C=r(30),P=r(40),L=r(1),I=r(73),R=r(74),T=r(45),N=r(28),M=r(21).forEach,F=E("hidden"),D=L("toPrimitive"),B=N.set,H=N.getterFor("Symbol"),V=Object.prototype,G=o.Symbol,$=o.JSON,W=$&&$.stringify,z=S.f,U=_.f,Y=x.f,X=A.f,q=k("symbols"),K=k("op-symbols"),J=k("string-to-symbol-registry"),Q=k("symbol-to-string-registry"),Z=k("wks"),tt=o.QObject,et=!tt||!tt.prototype||!tt.prototype.findChild,rt=a&&u((function(){return 7!=y(U({},"a",{get:function(){return U(this,"a",{value:7}).a}})).a}))?function(t,e,r){var n=z(V,e);n&&delete V[e],U(t,e,r),n&&t!==V&&U(V,e,n)}:U,nt=function(t,e){var r=q[t]=y(G.prototype);return B(r,{type:"Symbol",tag:t,description:e}),a||(r.description=e),r},ot=c&&"symbol"==typeof G.iterator?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof G},it=function(t,e,r){t===V&&it(K,e,r),p(t);var n=d(e,!0);return p(r),s(q,n)?(r.enumerable?(s(t,F)&&t[F][n]&&(t[F][n]=!1),r=y(r,{enumerable:g(0,!1)})):(s(t,F)||U(t,F,g(1,{})),t[F][n]=!0),rt(t,n,r)):U(t,n,r)},at=function(t,e){p(t);var r=h(e),n=b(r).concat(lt(r));return M(n,(function(e){a&&!ct.call(r,e)||it(t,e,r[e])})),t},ct=function(t){var e=d(t,!0),r=X.call(this,e);return!(this===V&&s(q,e)&&!s(K,e))&&(!(r||!s(this,e)||!s(q,e)||s(this,F)&&this[F][e])||r)},ut=function(t,e){var r=h(t),n=d(e,!0);if(r!==V||!s(q,n)||s(K,n)){var o=z(r,n);return!o||!s(q,n)||s(r,F)&&r[F][n]||(o.enumerable=!0),o}},st=function(t){var e=Y(h(t)),r=[];return M(e,(function(t){s(q,t)||s(C,t)||r.push(t)})),r},lt=function(t){var e=t===V,r=Y(e?K:h(t)),n=[];return M(r,(function(t){!s(q,t)||e&&!s(V,t)||n.push(q[t])})),n};c||(j((G=function(){if(this instanceof G)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,e=P(t),r=function(t){this===V&&r.call(K,t),s(this,F)&&s(this[F],e)&&(this[F][e]=!1),rt(this,e,g(1,t))};return a&&et&&rt(V,e,{configurable:!0,set:r}),nt(e,t)}).prototype,"toString",(function(){return H(this).tag})),A.f=ct,_.f=it,S.f=ut,m.f=x.f=st,w.f=lt,a&&(U(G.prototype,"description",{configurable:!0,get:function(){return H(this).description}}),i||j(V,"propertyIsEnumerable",ct,{unsafe:!0})),I.f=function(t){return nt(L(t),t)}),n({global:!0,wrap:!0,forced:!c,sham:!c},{Symbol:G}),M(b(Z),(function(t){R(t)})),n({target:"Symbol",stat:!0,forced:!c},{for:function(t){var e=String(t);if(s(J,e))return J[e];var r=G(e);return J[e]=r,Q[r]=e,r},keyFor:function(t){if(!ot(t))throw TypeError(t+" is not a symbol");if(s(Q,t))return Q[t]},useSetter:function(){et=!0},useSimple:function(){et=!1}}),n({target:"Object",stat:!0,forced:!c,sham:!a},{create:function(t,e){return void 0===e?y(t):at(y(t),e)},defineProperty:it,defineProperties:at,getOwnPropertyDescriptor:ut}),n({target:"Object",stat:!0,forced:!c},{getOwnPropertyNames:st,getOwnPropertySymbols:lt}),n({target:"Object",stat:!0,forced:u((function(){w.f(1)}))},{getOwnPropertySymbols:function(t){return w.f(v(t))}}),$&&n({target:"JSON",stat:!0,forced:!c||u((function(){var t=G();return"[null]"!=W([t])||"{}"!=W({a:t})||"{}"!=W(Object(t))}))},{stringify:function(t){for(var e,r,n=[t],o=1;arguments.length>o;)n.push(arguments[o++]);if(r=e=n[1],(f(e)||void 0!==t)&&!ot(t))return l(e)||(e=function(t,e){if("function"==typeof r&&(e=r.call(this,t,e)),!ot(e))return e}),n[1]=e,W.apply($,n)}}),G.prototype[D]||O(G.prototype,D,G.prototype.valueOf),T(G,"Symbol"),C[F]=!0},function(t,e,r){"use strict";var n={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,i=o&&!n.call({1:2},1);e.f=i?function(t){var e=o(this,t);return!!e&&e.enumerable}:n},function(t,e,r){var n=r(3),o=r(8);t.exports=function(t,e){try{o(n,t,e)}catch(r){n[t]=e}return e}},function(t,e){var r=0,n=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++r+n).toString(36)}},function(t,e,r){var n=r(68),o=r(3),i=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,e){return arguments.length<2?i(n[t])||i(o[t]):n[t]&&n[t][e]||o[t]&&o[t][e]}},function(t,e,r){var n=r(16),o=Math.max,i=Math.min;t.exports=function(t,e){var r=n(t);return r<0?o(r+e,0):i(r,e)}},function(t,e){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,r){var n=r(12).f,o=r(6),i=r(1)("toStringTag");t.exports=function(t,e,r){t&&!o(t=r?t:t.prototype,i)&&n(t,i,{configurable:!0,value:e})}},function(t,e,r){var n=r(5),o=r(32),i=r(1)("species");t.exports=function(t,e){var r;return o(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!o(r.prototype)?n(r)&&null===(r=r[i])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)}},function(t,e,r){"use strict";var n=r(0),o=r(7),i=r(3),a=r(6),c=r(5),u=r(12).f,s=r(66),l=i.Symbol;if(o&&"function"==typeof l&&(!("description"in l.prototype)||void 0!==l().description)){var f={},p=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),e=this instanceof p?new l(t):void 0===t?l():l(t);return""===t&&(f[e]=!0),e};s(p,l);var v=p.prototype=l.prototype;v.constructor=p;var h=v.toString,d="Symbol(test)"==String(l("test")),g=/^Symbol\((.*)\)[^)]+$/;u(v,"description",{configurable:!0,get:function(){var t=c(this)?this.valueOf():this,e=h.call(t);if(a(f,t))return"";var r=d?e.slice(7,-1):e.replace(g,"$1");return""===r?void 0:r}}),n({global:!0,forced:!0},{Symbol:p})}},function(t,e,r){r(74)("iterator")},function(t,e,r){"use strict";var n=r(0),o=r(2),i=r(32),a=r(5),c=r(13),u=r(9),s=r(22),l=r(46),f=r(23),p=r(1),v=r(77),h=p("isConcatSpreadable"),d=v>=51||!o((function(){var t=[];return t[h]=!1,t.concat()[0]!==t})),g=f("concat"),y=function(t){if(!a(t))return!1;var e=t[h];return void 0!==e?!!e:i(t)};n({target:"Array",proto:!0,forced:!d||!g},{concat:function(t){var e,r,n,o,i,a=c(this),f=l(a,0),p=0;for(e=-1,n=arguments.length;e<n;e++)if(i=-1===e?a:arguments[e],y(i)){if(p+(o=u(i.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(r=0;r<o;r++,p++)r in i&&s(f,p,i[r])}else{if(p>=9007199254740991)throw TypeError("Maximum allowed index exceeded");s(f,p++,i)}return f.length=p,f}})},function(t,e,r){var n=r(1),o=r(33),i=r(8),a=n("unscopables"),c=Array.prototype;null==c[a]&&i(c,a,o(null)),t.exports=function(t){c[a][t]=!0}},function(t,e,r){var n=r(0),o=r(110);n({target:"Object",stat:!0,forced:Object.assign!==o},{assign:o})},function(t,e,r){var n=r(0),o=r(13),i=r(34);n({target:"Object",stat:!0,forced:r(2)((function(){i(1)}))},{keys:function(t){return i(o(t))}})},function(t,e,r){"use strict";var n=r(15),o=r(4),i=r(2),a=r(87),c=RegExp.prototype,u=c.toString,s=i((function(){return"/a/b"!=u.call({source:"a",flags:"b"})})),l="toString"!=u.name;(s||l)&&n(RegExp.prototype,"toString",(function(){var t=o(this),e=String(t.source),r=t.flags;return"/"+e+"/"+String(void 0===r&&t instanceof RegExp&&!("flags"in c)?a.call(t):r)}),{unsafe:!0})},function(t,e,r){"use strict";var n=r(88).charAt,o=r(28),i=r(80),a=o.set,c=o.getterFor("String Iterator");i(String,"String",(function(t){a(this,{type:"String Iterator",string:String(t),index:0})}),(function(){var t,e=c(this),r=e.string,o=e.index;return o>=r.length?{value:void 0,done:!0}:(t=n(r,o),e.index+=t.length,{value:t,done:!1})}))},function(t,e,r){"use strict";var n=r(8),o=r(15),i=r(2),a=r(1),c=r(56),u=a("species"),s=!i((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),l=!i((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]}));t.exports=function(t,e,r,f){var p=a(t),v=!i((function(){var e={};return e[p]=function(){return 7},7!=""[t](e)})),h=v&&!i((function(){var e=!1,r=/a/;return"split"===t&&((r={}).constructor={},r.constructor[u]=function(){return r},r.flags="",r[p]=/./[p]),r.exec=function(){return e=!0,null},r[p](""),!e}));if(!v||!h||"replace"===t&&!s||"split"===t&&!l){var d=/./[p],g=r(p,""[t],(function(t,e,r,n,o){return e.exec===c?v&&!o?{done:!0,value:d.call(e,r,n)}:{done:!0,value:t.call(r,e,n)}:{done:!1}})),y=g[0],b=g[1];o(String.prototype,t,y),o(RegExp.prototype,p,2==e?function(t,e){return b.call(t,this,e)}:function(t){return b.call(t,this)}),f&&n(RegExp.prototype[p],"sham",!0)}}},function(t,e,r){"use strict";var n,o,i=r(87),a=RegExp.prototype.exec,c=String.prototype.replace,u=a,s=(n=/a/,o=/b*/g,a.call(n,"a"),a.call(o,"a"),0!==n.lastIndex||0!==o.lastIndex),l=void 0!==/()??/.exec("")[1];(s||l)&&(u=function(t){var e,r,n,o,u=this;return l&&(r=new RegExp("^"+u.source+"$(?!\\s)",i.call(u))),s&&(e=u.lastIndex),n=a.call(u,t),s&&n&&(u.lastIndex=u.global?n.index+n[0].length:e),l&&n&&n.length>1&&c.call(n[0],r,(function(){for(o=1;o<arguments.length-2;o++)void 0===arguments[o]&&(n[o]=void 0)})),n}),t.exports=u},function(t,e,r){"use strict";var n=r(88).charAt;t.exports=function(t,e,r){return e+(r?n(t,e).length:1)}},function(t,e,r){var n=r(14),o=r(56);t.exports=function(t,e){var r=t.exec;if("function"==typeof r){var i=r.call(t,e);if("object"!=typeof i)throw TypeError("RegExp exec method returned something other than an Object or null");return i}if("RegExp"!==n(t))throw TypeError("RegExp#exec called on incompatible receiver");return o.call(t,e)}},function(t,e,r){"use strict";var n=r(16),o=r(11);t.exports="".repeat||function(t){var e=String(o(this)),r="",i=n(t);if(i<0||i==1/0)throw RangeError("Wrong number of repetitions");for(;i>0;(i>>>=1)&&(e+=e))1&i&&(r+=e);return r}},function(t,e,r){var n=r(3),o=r(92),i=r(115),a=r(8);for(var c in o){var u=n[c],s=u&&u.prototype;if(s&&s.forEach!==i)try{a(s,"forEach",i)}catch(t){s.forEach=i}}},function(t,e,r){var n=r(3),o=r(92),i=r(35),a=r(8),c=r(1),u=c("iterator"),s=c("toStringTag"),l=i.values;for(var f in o){var p=n[f],v=p&&p.prototype;if(v){if(v[u]!==l)try{a(v,u,l)}catch(t){v[u]=l}if(v[s]||a(v,s,f),o[f])for(var h in i)if(v[h]!==i[h])try{a(v,h,i[h])}catch(t){v[h]=i[h]}}}},function(t,e,r){"use strict";var n=r(55),o=r(91),i=r(4),a=r(11),c=r(127),u=r(57),s=r(9),l=r(58),f=r(56),p=r(2),v=[].push,h=Math.min,d=!p((function(){return!RegExp(4294967295,"y")}));n("split",2,(function(t,e,r){var n;return n="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,r){var n=String(a(this)),i=void 0===r?4294967295:r>>>0;if(0===i)return[];if(void 0===t)return[n];if(!o(t))return e.call(n,t,i);for(var c,u,s,l=[],p=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),h=0,d=new RegExp(t.source,p+"g");(c=f.call(d,n))&&!((u=d.lastIndex)>h&&(l.push(n.slice(h,c.index)),c.length>1&&c.index<n.length&&v.apply(l,c.slice(1)),s=c[0].length,h=u,l.length>=i));)d.lastIndex===c.index&&d.lastIndex++;return h===n.length?!s&&d.test("")||l.push(""):l.push(n.slice(h)),l.length>i?l.slice(0,i):l}:"0".split(void 0,0).length?function(t,r){return void 0===t&&0===r?[]:e.call(this,t,r)}:e,[function(e,r){var o=a(this),i=null==e?void 0:e[t];return void 0!==i?i.call(e,o,r):n.call(String(o),e,r)},function(t,o){var a=r(n,t,this,o,n!==e);if(a.done)return a.value;var f=i(t),p=String(this),v=c(f,RegExp),g=f.unicode,y=(f.ignoreCase?"i":"")+(f.multiline?"m":"")+(f.unicode?"u":"")+(d?"y":"g"),b=new v(d?f:"^(?:"+f.source+")",y),m=void 0===o?4294967295:o>>>0;if(0===m)return[];if(0===p.length)return null===l(b,p)?[p]:[];for(var x=0,w=0,S=[];w<p.length;){b.lastIndex=d?w:0;var _,A=l(b,d?p:p.slice(w));if(null===A||(_=h(s(b.lastIndex+(d?0:w)),p.length))===x)w=u(p,w,g);else{if(S.push(p.slice(x,w)),S.length===m)return S;for(var O=1;O<=A.length-1;O++)if(S.push(A[O]),S.length===m)return S;w=x=_}}return S.push(p.slice(x)),S}]}),!d)},function(t,e,r){var n=r(7),o=r(2),i=r(64);t.exports=!n&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},function(t,e,r){var n=r(3),o=r(5),i=n.document,a=o(i)&&o(i.createElement);t.exports=function(t){return a?i.createElement(t):{}}},function(t,e,r){var n=r(20);t.exports=n("native-function-to-string",Function.toString)},function(t,e,r){var n=r(6),o=r(67),i=r(17),a=r(12);t.exports=function(t,e){for(var r=o(e),c=a.f,u=i.f,s=0;s<r.length;s++){var l=r[s];n(t,l)||c(t,l,u(e,l))}}},function(t,e,r){var n=r(41),o=r(31),i=r(44),a=r(4);t.exports=n("Reflect","ownKeys")||function(t){var e=o.f(a(t)),r=i.f;return r?e.concat(r(t)):e}},function(t,e,r){t.exports=r(3)},function(t,e,r){var n=r(6),o=r(10),i=r(70).indexOf,a=r(30);t.exports=function(t,e){var r,c=o(t),u=0,s=[];for(r in c)!n(a,r)&&n(c,r)&&s.push(r);for(;e.length>u;)n(c,r=e[u++])&&(~i(s,r)||s.push(r));return s}},function(t,e,r){var n=r(10),o=r(9),i=r(42),a=function(t){return function(e,r,a){var c,u=n(e),s=o(u.length),l=i(a,s);if(t&&r!=r){for(;s>l;)if((c=u[l++])!=c)return!0}else for(;s>l;l++)if((t||l in u)&&u[l]===r)return t||l||0;return!t&&-1}};t.exports={includes:a(!0),indexOf:a(!1)}},function(t,e,r){var n=r(2),o=/#|\.prototype\./,i=function(t,e){var r=c[a(t)];return r==s||r!=u&&("function"==typeof e?n(e):!!e)},a=i.normalize=function(t){return String(t).replace(o,".").toLowerCase()},c=i.data={},u=i.NATIVE="N",s=i.POLYFILL="P";t.exports=i},function(t,e,r){var n=r(2);t.exports=!!Object.getOwnPropertySymbols&&!n((function(){return!String(Symbol())}))},function(t,e,r){e.f=r(1)},function(t,e,r){var n=r(68),o=r(6),i=r(73),a=r(12).f;t.exports=function(t){var e=n.Symbol||(n.Symbol={});o(e,t)||a(e,t,{value:i.f(t)})}},function(t,e,r){var n=r(76);t.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},function(t,e,r){var n,o,i=r(3),a=r(78),c=i.process,u=c&&c.versions,s=u&&u.v8;s?o=(n=s.split("."))[0]+n[1]:a&&(!(n=a.match(/Edge\/(\d+)/))||n[1]>=74)&&(n=a.match(/Chrome\/(\d+)/))&&(o=n[1]),t.exports=o&&+o},function(t,e,r){var n=r(41);t.exports=n("navigator","userAgent")||""},function(t,e,r){"use strict";var n=r(0),o=r(21).find,i=r(50),a=!0;"find"in[]&&Array(1).find((function(){a=!1})),n({target:"Array",proto:!0,forced:a},{find:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),i("find")},function(t,e,r){"use strict";var n=r(0),o=r(105),i=r(82),a=r(83),c=r(45),u=r(8),s=r(15),l=r(1),f=r(27),p=r(24),v=r(81),h=v.IteratorPrototype,d=v.BUGGY_SAFARI_ITERATORS,g=l("iterator"),y=function(){return this};t.exports=function(t,e,r,l,v,b,m){o(r,e,l);var x,w,S,_=function(t){if(t===v&&E)return E;if(!d&&t in j)return j[t];switch(t){case"keys":case"values":case"entries":return function(){return new r(this,t)}}return function(){return new r(this)}},A=e+" Iterator",O=!1,j=t.prototype,k=j[g]||j["@@iterator"]||v&&j[v],E=!d&&k||_(v),C="Array"==e&&j.entries||k;if(C&&(x=i(C.call(new t)),h!==Object.prototype&&x.next&&(f||i(x)===h||(a?a(x,h):"function"!=typeof x[g]&&u(x,g,y)),c(x,A,!0,!0),f&&(p[A]=y))),"values"==v&&k&&"values"!==k.name&&(O=!0,E=function(){return k.call(this)}),f&&!m||j[g]===E||u(j,g,E),p[e]=E,v)if(w={values:_("values"),keys:b?E:_("keys"),entries:_("entries")},m)for(S in w)!d&&!O&&S in j||s(j,S,w[S]);else n({target:e,proto:!0,forced:d||O},w);return w}},function(t,e,r){"use strict";var n,o,i,a=r(82),c=r(8),u=r(6),s=r(1),l=r(27),f=s("iterator"),p=!1;[].keys&&("next"in(i=[].keys())?(o=a(a(i)))!==Object.prototype&&(n=o):p=!0),null==n&&(n={}),l||u(n,f)||c(n,f,(function(){return this})),t.exports={IteratorPrototype:n,BUGGY_SAFARI_ITERATORS:p}},function(t,e,r){var n=r(6),o=r(13),i=r(29),a=r(106),c=i("IE_PROTO"),u=Object.prototype;t.exports=a?Object.getPrototypeOf:function(t){return t=o(t),n(t,c)?t[c]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,r){var n=r(4),o=r(107);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,i){return n(r),o(i),e?t.call(r,i):r.__proto__=i,r}}():void 0)},function(t,e,r){var n=r(11),o="["+r(85)+"]",i=RegExp("^"+o+o+"*"),a=RegExp(o+o+"*$"),c=function(t){return function(e){var r=String(n(e));return 1&t&&(r=r.replace(i,"")),2&t&&(r=r.replace(a,"")),r}};t.exports={start:c(1),end:c(2),trim:c(3)}},function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},function(t,e,r){var n=r(14),o=r(1)("toStringTag"),i="Arguments"==n(function(){return arguments}());t.exports=function(t){var e,r,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),o))?r:i?n(e):"Object"==(a=n(e))&&"function"==typeof e.callee?"Arguments":a}},function(t,e,r){"use strict";var n=r(4);t.exports=function(){var t=n(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},function(t,e,r){var n=r(16),o=r(11),i=function(t){return function(e,r){var i,a,c=String(o(e)),u=n(r),s=c.length;return u<0||u>=s?t?"":void 0:(i=c.charCodeAt(u))<55296||i>56319||u+1===s||(a=c.charCodeAt(u+1))<56320||a>57343?t?c.charAt(u):i:t?c.slice(u,u+2):a-56320+(i-55296<<10)+65536}};t.exports={codeAt:i(!1),charAt:i(!0)}},function(t,e,r){"use strict";var n=r(55),o=r(4),i=r(9),a=r(11),c=r(57),u=r(58);n("match",1,(function(t,e,r){return[function(e){var r=a(this),n=null==e?void 0:e[t];return void 0!==n?n.call(e,r):new RegExp(e)[t](String(r))},function(t){var n=r(e,t,this);if(n.done)return n.value;var a=o(t),s=String(this);if(!a.global)return u(a,s);var l=a.unicode;a.lastIndex=0;for(var f,p=[],v=0;null!==(f=u(a,s));){var h=String(f[0]);p[v]=h,""===h&&(a.lastIndex=c(s,i(a.lastIndex),l)),v++}return 0===v?null:p}]}))},function(t,e,r){"use strict";var n=r(0),o=r(9),i=r(113),a=r(11),c=r(114),u="".startsWith,s=Math.min;n({target:"String",proto:!0,forced:!c("startsWith")},{startsWith:function(t){var e=String(a(this));i(t);var r=o(s(arguments.length>1?arguments[1]:void 0,e.length)),n=String(t);return u?u.call(e,n,r):e.slice(r,r+n.length)===n}})},function(t,e,r){var n=r(5),o=r(14),i=r(1)("match");t.exports=function(t){var e;return n(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==o(t))}},function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},function(t,e,r){"use strict";var n=r(2);t.exports=function(t,e){var r=[][t];return!r||!n((function(){r.call(null,e||function(){throw 1},1)}))}},function(t,e,r){"use strict";var n=r(0),o=r(26),i=r(10),a=r(93),c=[].join,u=o!=Object,s=a("join",",");n({target:"Array",proto:!0,forced:u||s},{join:function(t){return c.call(i(this),void 0===t?",":t)}})},function(t,e,r){"use strict";var n=r(0),o=r(21).map;n({target:"Array",proto:!0,forced:!r(23)("map")},{map:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},function(t,e,r){"use strict";var n=r(0),o=r(130).start;n({target:"String",proto:!0,forced:r(131)},{padStart:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},function(t){t.exports=JSON.parse('{"a":"1.4.7"}')},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){var n=r(3),o=r(39),i=n["__core-js_shared__"]||o("__core-js_shared__",{});t.exports=i},function(t,e,r){var n=r(3),o=r(65),i=n.WeakMap;t.exports="function"==typeof i&&/native code/.test(o.call(i))},function(t,e,r){var n=r(7),o=r(12),i=r(4),a=r(34);t.exports=n?Object.defineProperties:function(t,e){i(t);for(var r,n=a(e),c=n.length,u=0;c>u;)o.f(t,r=n[u++],e[r]);return t}},function(t,e,r){var n=r(41);t.exports=n("document","documentElement")},function(t,e,r){var n=r(10),o=r(31).f,i={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return a&&"[object Window]"==i.call(t)?function(t){try{return o(t)}catch(t){return a.slice()}}(t):o(n(t))}},function(t,e,r){"use strict";var n=r(0),o=r(70).includes,i=r(50);n({target:"Array",proto:!0},{includes:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),i("includes")},function(t,e,r){"use strict";var n=r(81).IteratorPrototype,o=r(33),i=r(18),a=r(45),c=r(24),u=function(){return this};t.exports=function(t,e,r){var s=e+" Iterator";return t.prototype=o(n,{next:i(1,r)}),a(t,s,!1,!0),c[s]=u,t}},function(t,e,r){var n=r(2);t.exports=!n((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},function(t,e,r){var n=r(5);t.exports=function(t){if(!n(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype");return t}},function(t,e,r){"use strict";var n=r(0),o=r(42),i=r(16),a=r(9),c=r(13),u=r(46),s=r(22),l=r(23),f=Math.max,p=Math.min;n({target:"Array",proto:!0,forced:!l("splice")},{splice:function(t,e){var r,n,l,v,h,d,g=c(this),y=a(g.length),b=o(t,y),m=arguments.length;if(0===m?r=n=0:1===m?(r=0,n=y-b):(r=m-2,n=p(f(i(e),0),y-b)),y+r-n>9007199254740991)throw TypeError("Maximum allowed length exceeded");for(l=u(g,n),v=0;v<n;v++)(h=b+v)in g&&s(l,v,g[h]);if(l.length=n,r<n){for(v=b;v<y-n;v++)d=v+r,(h=v+n)in g?g[d]=g[h]:delete g[d];for(v=y;v>y-n+r;v--)delete g[v-1]}else if(r>n)for(v=y-n;v>b;v--)d=v+r-1,(h=v+n-1)in g?g[d]=g[h]:delete g[d];for(v=0;v<r;v++)g[v+b]=arguments[v+2];return g.length=y-n+r,l}})},function(t,e,r){var n=r(5),o=r(83);t.exports=function(t,e,r){var i,a;return o&&"function"==typeof(i=e.constructor)&&i!==r&&n(a=i.prototype)&&a!==r.prototype&&o(t,a),t}},function(t,e,r){"use strict";var n=r(7),o=r(2),i=r(34),a=r(44),c=r(38),u=r(13),s=r(26),l=Object.assign;t.exports=!l||o((function(){var t={},e={},r=Symbol();return t[r]=7,"abcdefghijklmnopqrst".split("").forEach((function(t){e[t]=t})),7!=l({},t)[r]||"abcdefghijklmnopqrst"!=i(l({},e)).join("")}))?function(t,e){for(var r=u(t),o=arguments.length,l=1,f=a.f,p=c.f;o>l;)for(var v,h=s(arguments[l++]),d=f?i(h).concat(f(h)):i(h),g=d.length,y=0;g>y;)v=d[y++],n&&!p.call(h,v)||(r[v]=h[v]);return r}:l},function(t,e,r){"use strict";var n=r(86),o={};o[r(1)("toStringTag")]="z",t.exports="[object z]"!==String(o)?function(){return"[object "+n(this)+"]"}:o.toString},function(t,e,r){r(0)({target:"String",proto:!0},{repeat:r(59)})},function(t,e,r){var n=r(91);t.exports=function(t){if(n(t))throw TypeError("The method doesn't accept regular expressions");return t}},function(t,e,r){var n=r(1)("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[n]=!1,"/./"[t](e)}catch(t){}}return!1}},function(t,e,r){"use strict";var n=r(21).forEach,o=r(93);t.exports=o("forEach")?function(t){return n(this,t,arguments.length>1?arguments[1]:void 0)}:[].forEach},function(t,e,r){"use strict";var n=r(0),o=r(21).filter;n({target:"Array",proto:!0,forced:!r(23)("filter")},{filter:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},function(t,e,r){var n=r(0),o=r(118);n({target:"Array",stat:!0,forced:!r(122)((function(t){Array.from(t)}))},{from:o})},function(t,e,r){"use strict";var n=r(75),o=r(13),i=r(119),a=r(120),c=r(9),u=r(22),s=r(121);t.exports=function(t){var e,r,l,f,p,v=o(t),h="function"==typeof this?this:Array,d=arguments.length,g=d>1?arguments[1]:void 0,y=void 0!==g,b=0,m=s(v);if(y&&(g=n(g,d>2?arguments[2]:void 0,2)),null==m||h==Array&&a(m))for(r=new h(e=c(v.length));e>b;b++)u(r,b,y?g(v[b],b):v[b]);else for(p=(f=m.call(v)).next,r=new h;!(l=p.call(f)).done;b++)u(r,b,y?i(f,g,[l.value,b],!0):l.value);return r.length=b,r}},function(t,e,r){var n=r(4);t.exports=function(t,e,r,o){try{return o?e(n(r)[0],r[1]):e(r)}catch(e){var i=t.return;throw void 0!==i&&n(i.call(t)),e}}},function(t,e,r){var n=r(1),o=r(24),i=n("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||a[i]===t)}},function(t,e,r){var n=r(86),o=r(24),i=r(1)("iterator");t.exports=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[n(t)]}},function(t,e,r){var n=r(1)("iterator"),o=!1;try{var i=0,a={next:function(){return{done:!!i++}},return:function(){o=!0}};a[n]=function(){return this},Array.from(a,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var r=!1;try{var i={};i[n]=function(){return{next:function(){return{done:r=!0}}}},t(i)}catch(t){}return r}},function(t,e,r){"use strict";var n=r(0),o=r(5),i=r(32),a=r(42),c=r(9),u=r(10),s=r(22),l=r(23),f=r(1)("species"),p=[].slice,v=Math.max;n({target:"Array",proto:!0,forced:!l("slice")},{slice:function(t,e){var r,n,l,h=u(this),d=c(h.length),g=a(t,d),y=a(void 0===e?d:e,d);if(i(h)&&("function"!=typeof(r=h.constructor)||r!==Array&&!i(r.prototype)?o(r)&&null===(r=r[f])&&(r=void 0):r=void 0,r===Array||void 0===r))return p.call(h,g,y);for(n=new(void 0===r?Array:r)(v(y-g,0)),l=0;g<y;g++,l++)g in h&&s(n,l,h[g]);return n.length=l,n}})},function(t,e,r){var n=r(0),o=r(2),i=r(10),a=r(17).f,c=r(7),u=o((function(){a(1)}));n({target:"Object",stat:!0,forced:!c||u,sham:!c},{getOwnPropertyDescriptor:function(t,e){return a(i(t),e)}})},function(t,e,r){var n=r(0),o=r(7),i=r(67),a=r(10),c=r(17),u=r(22);n({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(t){for(var e,r,n=a(t),o=c.f,s=i(n),l={},f=0;s.length>f;)void 0!==(r=o(n,e=s[f++]))&&u(l,e,r);return l}})},function(t,e,r){"use strict";var n=r(55),o=r(4),i=r(13),a=r(9),c=r(16),u=r(11),s=r(57),l=r(58),f=Math.max,p=Math.min,v=Math.floor,h=/\$([$&'`]|\d\d?|<[^>]*>)/g,d=/\$([$&'`]|\d\d?)/g;n("replace",2,(function(t,e,r){return[function(r,n){var o=u(this),i=null==r?void 0:r[t];return void 0!==i?i.call(r,o,n):e.call(String(o),r,n)},function(t,i){var u=r(e,t,this,i);if(u.done)return u.value;var v=o(t),h=String(this),d="function"==typeof i;d||(i=String(i));var g=v.global;if(g){var y=v.unicode;v.lastIndex=0}for(var b=[];;){var m=l(v,h);if(null===m)break;if(b.push(m),!g)break;""===String(m[0])&&(v.lastIndex=s(h,a(v.lastIndex),y))}for(var x,w="",S=0,_=0;_<b.length;_++){m=b[_];for(var A=String(m[0]),O=f(p(c(m.index),h.length),0),j=[],k=1;k<m.length;k++)j.push(void 0===(x=m[k])?x:String(x));var E=m.groups;if(d){var C=[A].concat(j,O,h);void 0!==E&&C.push(E);var P=String(i.apply(void 0,C))}else P=n(A,h,O,j,E,i);O>=S&&(w+=h.slice(S,O)+P,S=O+A.length)}return w+h.slice(S)}];function n(t,r,n,o,a,c){var u=n+t.length,s=o.length,l=d;return void 0!==a&&(a=i(a),l=h),e.call(c,l,(function(e,i){var c;switch(i.charAt(0)){case"$":return"$";case"&":return t;case"`":return r.slice(0,n);case"'":return r.slice(u);case"<":c=a[i.slice(1,-1)];break;default:var l=+i;if(0===l)return e;if(l>s){var f=v(l/10);return 0===f?e:f<=s?void 0===o[f-1]?i.charAt(1):o[f-1]+i.charAt(1):e}c=o[l-1]}return void 0===c?"":c}))}}))},function(t,e,r){var n=r(4),o=r(76),i=r(1)("species");t.exports=function(t,e){var r,a=n(t).constructor;return void 0===a||null==(r=n(a)[i])?e:o(r)}},function(t,e,r){"use strict";var n=r(0),o=r(84).trim;n({target:"String",proto:!0,forced:r(129)("trim")},{trim:function(){return o(this)}})},function(t,e,r){var n=r(2),o=r(85);t.exports=function(t){return n((function(){return!!o[t]()||"​ "!="​ "[t]()||o[t].name!==t}))}},function(t,e,r){var n=r(9),o=r(59),i=r(11),a=Math.ceil,c=function(t){return function(e,r,c){var u,s,l=String(i(e)),f=l.length,p=void 0===c?" ":String(c),v=n(r);return v<=f||""==p?l:(u=v-f,(s=o.call(p,a(u/p.length))).length>u&&(s=s.slice(0,u)),t?l+s:s+l)}};t.exports={start:c(!1),end:c(!0)}},function(t,e,r){var n=r(78);t.exports=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(n)},function(t,e,r){"use strict";var n=r(0),o=r(16),i=r(133),a=r(59),c=r(2),u=1..toFixed,s=Math.floor,l=function(t,e,r){return 0===e?r:e%2==1?l(t,e-1,r*t):l(t*t,e/2,r)};n({target:"Number",proto:!0,forced:u&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!c((function(){u.call({})}))},{toFixed:function(t){var e,r,n,c,u=i(this),f=o(t),p=[0,0,0,0,0,0],v="",h="0",d=function(t,e){for(var r=-1,n=e;++r<6;)n+=t*p[r],p[r]=n%1e7,n=s(n/1e7)},g=function(t){for(var e=6,r=0;--e>=0;)r+=p[e],p[e]=s(r/t),r=r%t*1e7},y=function(){for(var t=6,e="";--t>=0;)if(""!==e||0===t||0!==p[t]){var r=String(p[t]);e=""===e?r:e+a.call("0",7-r.length)+r}return e};if(f<0||f>20)throw RangeError("Incorrect fraction digits");if(u!=u)return"NaN";if(u<=-1e21||u>=1e21)return String(u);if(u<0&&(v="-",u=-u),u>1e-21)if(r=(e=function(t){for(var e=0,r=t;r>=4096;)e+=12,r/=4096;for(;r>=2;)e+=1,r/=2;return e}(u*l(2,69,1))-69)<0?u*l(2,-e,1):u/l(2,e,1),r*=4503599627370496,(e=52-e)>0){for(d(0,r),n=f;n>=7;)d(1e7,0),n-=7;for(d(l(10,n,1),0),n=e-1;n>=23;)g(1<<23),n-=23;g(1<<n),d(1,1),g(2),h=y()}else d(0,r),d(1<<-e,0),h=y()+a.call("0",f);return h=f>0?v+((c=h.length)<=f?"0."+a.call("0",f-c)+h:h.slice(0,c-f)+"."+h.slice(c-f)):v+h}})},function(t,e,r){var n=r(14);t.exports=function(t){if("number"!=typeof t&&"Number"!=n(t))throw TypeError("Incorrect invocation");return+t}},function(t,e,r){"use strict";r.r(e);var n={};r.r(n),r.d(n,"on",(function(){return c})),r.d(n,"off",(function(){return u})),r.d(n,"createElementFromString",(function(){return l})),r.d(n,"removeAttribute",(function(){return f})),r.d(n,"createFromTemplate",(function(){return p})),r.d(n,"eventPath",(function(){return v})),r.d(n,"resolveElement",(function(){return h})),r.d(n,"adjustableInputNumbers",(function(){return d}));r(37),r(47),r(48),r(49),r(79),r(104),r(35),r(108),r(36),r(51),r(52),r(25),r(53),r(54),r(89),r(112),r(90),r(60),r(61),r(116),r(117),r(123),r(124),r(125),r(126),r(62),r(128);function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(r,!0).forEach((function(e){a(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(r).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var c=s.bind(null,"addEventListener"),u=s.bind(null,"removeEventListener");function s(t,e,r,n,o){void 0===o&&(o={}),e instanceof HTMLCollection||e instanceof NodeList?e=Array.from(e):Array.isArray(e)||(e=[e]),Array.isArray(r)||(r=[r]);var a=e,c=Array.isArray(a),u=0;for(a=c?a:a[Symbol.iterator]();;){var s;if(c){if(u>=a.length)break;s=a[u++]}else{if((u=a.next()).done)break;s=u.value}var l=s,f=r,p=Array.isArray(f),v=0;for(f=p?f:f[Symbol.iterator]();;){var h;if(p){if(v>=f.length)break;h=f[v++]}else{if((v=f.next()).done)break;h=v.value}var d=h;l[t](d,n,i({capture:!1},o))}}return Array.prototype.slice.call(arguments,1)}function l(t){var e=document.createElement("div");return e.innerHTML=t.trim(),e.firstElementChild}function f(t,e){var r=t.getAttribute(e);return t.removeAttribute(e),r}function p(t){return function t(e,r){void 0===r&&(r={});var n=f(e,":obj"),o=f(e,":ref"),i=n?r[n]={}:r;o&&(r[o]=e);for(var a=0,c=Array.from(e.children);a<c.length;a++){var u=c[a],s=f(u,":arr"),l=t(u,s?{}:i);s&&(i[s]||(i[s]=[])).push(Object.keys(l).length?l:u)}return r}(l(t))}function v(t){var e=t.path||t.composedPath&&t.composedPath();if(e)return e;var r=t.target.parentElement;for(e=[t.target,r];r=r.parentElement;)e.push(r);return e.push(document,window),e}function h(t){return t instanceof Element?t:"string"==typeof t?t.split(/>>/g).reduce((function(t,e,r,n){return t=t.querySelector(e),r<n.length-1?t.shadowRoot:t}),document):null}function d(t,e){function r(r){var n=[.001,.01,.1][Number(r.shiftKey||2*r.ctrlKey)]*(r.deltaY<0?1:-1),o=0,i=t.selectionStart;t.value=t.value.replace(/[\d.]+/g,(function(t,r){return r<=i&&r+t.length>=i?(i=r,e(Number(t),n,o)):(o++,t)})),t.focus(),t.setSelectionRange(i,i),r.preventDefault(),t.dispatchEvent(new Event("input"))}void 0===e&&(e=function(t){return t}),c(t,"focus",(function(){return c(window,"wheel",r,{passive:!1})})),c(t,"blur",(function(){return u(window,"wheel",r)}))}var g=r(97),y=(r(94),r(95),r(96),Math.min),b=Math.max,m=Math.floor,x=Math.round;function w(t,e,r){e/=100,r/=100;var n=m(t=t/360*6),o=t-n,i=r*(1-e),a=r*(1-o*e),c=r*(1-(1-o)*e),u=n%6;return[255*[r,a,i,i,c,r][u],255*[c,r,r,a,i,i][u],255*[i,i,c,r,r,a][u]]}function S(t,e,r){var n,o,i=y(t/=255,e/=255,r/=255),a=b(t,e,r),c=a-i;if(0===c)n=o=0;else{o=c/a;var u=((a-t)/6+c/2)/c,s=((a-e)/6+c/2)/c,l=((a-r)/6+c/2)/c;t===a?n=l-s:e===a?n=1/3+u-l:r===a&&(n=2/3+s-u),n<0?n+=1:n>1&&(n-=1)}return[360*n,100*o,100*a]}function _(t,e,r,n){e/=100,r/=100;var o=255*(1-y(1,(t/=100)*(1-(n/=100))+n)),i=255*(1-y(1,e*(1-n)+n)),a=255*(1-y(1,r*(1-n)+n));return[].concat(S(o,i,a))}function A(t,e,r){return e/=100,[t,2*(e*=(r/=100)<.5?r:1-r)/(r+e)*100,100*(r+e)]}function O(t){return S.apply(void 0,t.match(/.{2}/g).map((function(t){return parseInt(t,16)})))}function j(t){t=t.match(/^[a-zA-Z]+$/)?function(t){if("black"===t.toLowerCase())return"#000";var e=document.createElement("canvas").getContext("2d");return e.fillStyle=t,"#000"===e.fillStyle?null:e.fillStyle}(t):t;var e,r={cmyk:/^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i,rgba:/^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,hsla:/^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,hsva:/^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,hexa:/^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i},n=function(t){return t.map((function(t){return/^(|\d+)\.\d+|\d+$/.test(t)?Number(t):void 0}))};t:for(var o in r)if(e=r[o].exec(t)){var i=function(t){return!!e[2]==("number"==typeof t)};switch(o){case"cmyk":var a=n(e),c=a[1],u=a[2],s=a[3],l=a[4];if(c>100||u>100||s>100||l>100)break t;return{values:_(c,u,s,l),type:o};case"rgba":var f=n(e),p=f[3],v=f[4],h=f[5],d=f[6];if(p>255||v>255||h>255||d<0||d>1||!i(d))break t;return{values:[].concat(S(p,v,h),[d]),a:d,type:o};case"hexa":var g=e[1];4!==g.length&&3!==g.length||(g=g.split("").map((function(t){return t+t})).join(""));var y=g.substring(0,6),b=g.substring(6);return b=b?parseInt(b,16)/255:void 0,{values:[].concat(O(y),[b]),a:b,type:o};case"hsla":var m=n(e),x=m[3],w=m[4],j=m[5],k=m[6];if(x>360||w>100||j>100||k<0||k>1||!i(k))break t;return{values:[].concat(A(x,w,j),[k]),a:k,type:o};case"hsva":var E=n(e),C=E[3],P=E[4],L=E[5],I=E[6];if(C>360||P>100||L>100||I<0||I>1||!i(I))break t;return{values:[C,P,L,I],a:I,type:o}}}return{values:null,type:null}}r(132);function k(t,e,r,n){void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0),void 0===n&&(n=1);var o=function(t,e){return function(r){return void 0===r&&(r=-1),e(~r?t.map((function(t){return Number(t.toFixed(r))})):t)}},i={h:t,s:e,v:r,a:n,toHSVA:function(){var t=[i.h,i.s,i.v,i.a];return t.toString=o(t,(function(t){return"hsva("+t[0]+", "+t[1]+"%, "+t[2]+"%, "+i.a+")"})),t},toHSLA:function(){var t=[].concat(function(t,e,r){var n=(2-(e/=100))*(r/=100)/2;return 0!==n&&(e=1===n?0:n<.5?e*r/(2*n):e*r/(2-2*n)),[t,100*e,100*n]}(i.h,i.s,i.v),[i.a]);return t.toString=o(t,(function(t){return"hsla("+t[0]+", "+t[1]+"%, "+t[2]+"%, "+i.a+")"})),t},toRGBA:function(){var t=[].concat(w(i.h,i.s,i.v),[i.a]);return t.toString=o(t,(function(t){return"rgba("+t[0]+", "+t[1]+", "+t[2]+", "+i.a+")"})),t},toCMYK:function(){var t=function(t,e,r){var n,o=w(t,e,r),i=o[0]/255,a=o[1]/255,c=o[2]/255;return[100*(1===(n=y(1-i,1-a,1-c))?0:(1-i-n)/(1-n)),100*(1===n?0:(1-a-n)/(1-n)),100*(1===n?0:(1-c-n)/(1-n)),100*n]}(i.h,i.s,i.v);return t.toString=o(t,(function(t){return"cmyk("+t[0]+"%, "+t[1]+"%, "+t[2]+"%, "+t[3]+"%)"})),t},toHEXA:function(){var t=function(t,e,r){return w(t,e,r).map((function(t){return x(t).toString(16).padStart(2,"0")}))}(i.h,i.s,i.v),e=i.a>=1?"":Number((255*i.a).toFixed(0)).toString(16).toUpperCase().padStart(2,"0");return e&&t.push(e),t.toString=function(){return"#"+t.join("").toUpperCase()},t},clone:function(){return k(i.h,i.s,i.v,i.a)}};return i}var E=function(t){return Math.max(Math.min(t,1),0)};function C(t){var e={options:Object.assign({lock:null,onchange:function(){return 0},onstop:function(){return 0}},t),_keyboard:function(t){var n=t.type,o=t.key;if(document.activeElement===r.wrapper){var i=e.options.lock,a="ArrowUp"===o,c="ArrowRight"===o,u="ArrowDown"===o,s="ArrowLeft"===o;if("keydown"===n&&(a||c||u||s)){var l=0,f=0;"v"===i?l=a||c?1:-1:"h"===i?l=a||c?-1:1:(f=a?-1:u?1:0,l=s?-1:c?1:0),e.update(E(e.cache.x+.01*l),E(e.cache.y+.01*f)),t.preventDefault()}else o.startsWith("Arrow")&&(e.options.onstop(),t.preventDefault())}},_tapstart:function(t){c(document,["mouseup","touchend","touchcancel"],e._tapstop),c(document,["mousemove","touchmove"],e._tapmove),t.preventDefault(),e._tapmove(t)},_tapmove:function(t){var n=e.options.lock,o=e.cache,i=r.element,a=r.wrapper,c=a.getBoundingClientRect(),u=0,s=0;if(t){var l=t&&t.touches&&t.touches[0];u=t?(l||t).clientX:0,s=t?(l||t).clientY:0,u<c.left?u=c.left:u>c.left+c.width&&(u=c.left+c.width),s<c.top?s=c.top:s>c.top+c.height&&(s=c.top+c.height),u-=c.left,s-=c.top}else o&&(u=o.x*c.width,s=o.y*c.height);"h"!==n&&(i.style.left="calc("+u/c.width*100+"% - "+i.offsetWidth/2+"px)"),"v"!==n&&(i.style.top="calc("+s/c.height*100+"% - "+i.offsetHeight/2+"px)"),e.cache={x:u/c.width,y:s/c.height};var f=E(u/a.offsetWidth),p=E(s/a.offsetHeight);switch(n){case"v":return r.onchange(f);case"h":return r.onchange(p);default:return r.onchange(f,p)}},_tapstop:function(){e.options.onstop(),u(document,["mouseup","touchend","touchcancel"],e._tapstop),u(document,["mousemove","touchmove"],e._tapmove)},trigger:function(){e._tapmove()},update:function(t,r){void 0===t&&(t=0),void 0===r&&(r=0);var n=e.options.wrapper.getBoundingClientRect(),o=n.left,i=n.top,a=n.width,c=n.height;"h"===e.options.lock&&(r=t),e._tapmove({clientX:o+a*t,clientY:i+c*r})},destroy:function(){var t=e.options,r=e._tapstart;u([t.wrapper,t.element],"mousedown",r),u([t.wrapper,t.element],"touchstart",r,{passive:!1})}},r=e.options,n=e._tapstart,o=e._keyboard;return c([r.wrapper,r.element],"mousedown",n),c([r.wrapper,r.element],"touchstart",n,{passive:!1}),c(document,["keydown","keyup"],o),e}function P(t){void 0===t&&(t={}),t=Object.assign({onchange:function(){return 0},className:"",elements:[]},t);var e=c(t.elements,"click",(function(e){t.elements.forEach((function(r){return r.classList[e.target===r?"add":"remove"](t.className)})),t.onchange(e)}));return{destroy:function(){return u.apply(n,e)}}}function L(t){var e,r=t.el,n=t.reference,o=t.padding,i=void 0===o?8:o,a={start:"sme",middle:"mse",end:"ems"},c={top:"tbrl",right:"rltb",bottom:"btrl",left:"lrbt"},u=(void 0===e&&(e={}),function(t,r){if(void 0===r&&(r=e[t]),r)return r;var n=t.split("-"),o=n[0],i=n[1],a=void 0===i?"middle":i,c="top"===o||"bottom"===o;return e[t]={position:o,variant:a,isVertical:c}});return{update:function(t){var e=u(t),o=e.position,s=e.variant,l=e.isVertical,f=n.getBoundingClientRect(),p=r.getBoundingClientRect(),v=function(t){return t?{s:f.left+f.width-p.width,m:-p.width/2+(f.left+f.width/2),e:f.left}:{s:f.bottom-p.height,m:f.bottom-f.height/2-p.height/2,e:f.bottom-f.height}},h={};function d(t,e,n){var o="top"===n,i=o?p.height:p.width,a=window[o?"innerHeight":"innerWidth"],c=t,u=Array.isArray(c),s=0;for(c=u?c:c[Symbol.iterator]();;){var l;if(u){if(s>=c.length)break;l=c[s++]}else{if((s=c.next()).done)break;l=s.value}var f=e[l],v=h[n]=f+"px";if(f>0&&f+i<a)return r.style[n]=v,!0}return!1}for(var g=0,y=[l,!l];g<y.length;g++){var b=y[g],m=d(c[o],b?{t:f.top-p.height-i,b:f.bottom+i}:{r:f.right+i,l:f.left-p.width-i},b?"top":"left"),x=d(a[s],v(b),b?"left":"top");if(m&&x)return}r.style.left=h.left,r.style.top=h.top}}}function I(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var R=function(){function t(t){var e=this;I(this,"_initializingActive",!0),I(this,"_recalc",!0),I(this,"_color",k()),I(this,"_lastColor",k()),I(this,"_swatchColors",[]),I(this,"_eventListener",{init:[],save:[],hide:[],show:[],clear:[],change:[],changestop:[],cancel:[],swatchselect:[]}),this.options=t=Object.assign({appClass:null,theme:"classic",useAsButton:!1,padding:8,disabled:!1,comparison:!0,closeOnScroll:!1,outputPrecision:0,lockOpacity:!1,autoReposition:!0,container:"body",components:{interaction:{}},strings:{},swatches:null,inline:!1,sliders:null,default:"#42445a",defaultRepresentation:null,position:"bottom-middle",adjustableNumbers:!0,showAlways:!1,closeWithKey:"Escape"},t);var r=t,n=r.swatches,o=r.components,i=r.theme,a=r.sliders,c=r.lockOpacity,u=r.padding;["nano","monolith"].includes(i)&&!a&&(t.sliders="h"),o.interaction||(o.interaction={});var s=o.preview,l=o.opacity,f=o.hue,p=o.palette;o.opacity=!c&&l,o.palette=p||s||l||f,this._preBuild(),this._buildComponents(),this._bindEvents(),this._finalBuild(),n&&n.length&&n.forEach((function(t){return e.addSwatch(t)}));var v=this._root,h=v.button,d=v.app;this._nanopop=L({reference:h,padding:u,el:d}),h.setAttribute("role","button"),h.setAttribute("aria-label","toggle color picker dialog");var g=this;requestAnimationFrame((function e(){if(!d.offsetWidth&&d.parentElement!==t.container)return requestAnimationFrame(e);g.setColor(t.default),g._rePositioningPicker(),t.defaultRepresentation&&(g._representation=t.defaultRepresentation,g.setColorRepresentation(g._representation)),t.showAlways&&g.show(),g._initializingActive=!1,g._emit("init")}))}var e=t.prototype;return e._preBuild=function(){for(var t,e,r,n,o,i,a,c,u,s,l,f=this.options,v=0,d=["el","container"];v<d.length;v++){var g=d[v];f[g]=h(f[g])}this._root=(e=(t=f).components,r=t.strings,n=t.useAsButton,o=t.inline,i=t.appClass,a=t.theme,c=t.lockOpacity,s=p('\n      <div :ref="root" class="pickr">\n\n        '+(n?"":'<button type="button" :ref="button" class="pcr-button"></button>')+'\n\n        <div :ref="app" class="pcr-app '+(i||"")+'" data-theme="'+a+'" '+(o?'style="position: unset"':"")+' aria-label="color picker dialog" role="form">\n          <div class="pcr-selection" '+(u=function(t){return t?"":'style="display:none" hidden'})(e.palette)+'>\n            <div :obj="preview" class="pcr-color-preview" '+u(e.preview)+'>\n              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="use previous color"></button>\n              <div :ref="currentColor" class="pcr-current-color"></div>\n            </div>\n\n            <div :obj="palette" class="pcr-color-palette">\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="color selection area" role="listbox"></div>\n            </div>\n\n            <div :obj="hue" class="pcr-color-chooser" '+u(e.hue)+'>\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="hue selection slider" role="slider"></div>\n            </div>\n\n            <div :obj="opacity" class="pcr-color-opacity" '+u(e.opacity)+'>\n              <div :ref="picker" class="pcr-picker"></div>\n              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="opacity selection slider" role="slider"></div>\n            </div>\n          </div>\n\n          <div class="pcr-swatches '+(e.palette?"":"pcr-last")+'" :ref="swatches"></div> \n\n          <div :obj="interaction" class="pcr-interaction" '+u(Object.keys(e.interaction).length)+'>\n            <input :ref="result" class="pcr-result" type="text" spellcheck="false" '+u(e.interaction.input)+'>\n\n            <input :arr="options" class="pcr-type" data-type="HEXA" value="'+(c?"HEX":"HEXA")+'" type="button" '+u(e.interaction.hex)+'>\n            <input :arr="options" class="pcr-type" data-type="RGBA" value="'+(c?"RGB":"RGBA")+'" type="button" '+u(e.interaction.rgba)+'>\n            <input :arr="options" class="pcr-type" data-type="HSLA" value="'+(c?"HSL":"HSLA")+'" type="button" '+u(e.interaction.hsla)+'>\n            <input :arr="options" class="pcr-type" data-type="HSVA" value="'+(c?"HSV":"HSVA")+'" type="button" '+u(e.interaction.hsva)+'>\n            <input :arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" '+u(e.interaction.cmyk)+'>\n\n            <input :ref="save" class="pcr-save" value="'+(r.save||"Save")+'" type="button" '+u(e.interaction.save)+' aria-label="save and exit">\n            <input :ref="cancel" class="pcr-cancel" value="'+(r.cancel||"Cancel")+'" type="button" '+u(e.interaction.cancel)+' aria-label="cancel and exit">\n            <input :ref="clear" class="pcr-clear" value="'+(r.clear||"Clear")+'" type="button" '+u(e.interaction.clear)+' aria-label="clear and exit">\n          </div>\n        </div>\n      </div>\n    '),(l=s.interaction).options.find((function(t){return!t.hidden&&!t.classList.add("active")})),l.type=function(){return l.options.find((function(t){return t.classList.contains("active")}))},s),f.useAsButton&&(this._root.button=f.el),f.container.appendChild(this._root.root)},e._finalBuild=function(){var t=this.options,e=this._root;if(t.container.removeChild(e.root),t.inline){var r=t.el.parentElement;t.el.nextSibling?r.insertBefore(e.app,t.el.nextSibling):r.appendChild(e.app)}else t.container.appendChild(e.app);t.useAsButton?t.inline&&t.el.remove():t.el.parentNode.replaceChild(e.root,t.el),t.disabled&&this.disable(),t.comparison||(e.button.style.transition="none",t.useAsButton||(e.preview.lastColor.style.transition="none")),this.hide()},e._buildComponents=function(){var t=this,e=this,r=this.options.components,n=(e.options.sliders||"v").repeat(2),o=n.match(/^[vh]+$/g)?n:[],i=o[0],a=o[1],c=function(){return t._color||(t._color=t._lastColor.clone())},u={palette:C({element:e._root.palette.picker,wrapper:e._root.palette.palette,onstop:function(){return e._emit("changestop",e)},onchange:function(t,n){if(r.palette){var o=c(),i=e._root,a=e.options;e._recalc&&(o.s=100*t,o.v=100-100*n,o.v<0&&(o.v=0),e._updateOutput());var u=o.toRGBA().toString(0);this.element.style.background=u,this.wrapper.style.background="\n                        linear-gradient(to top, rgba(0, 0, 0, "+o.a+"), transparent),\n                        linear-gradient(to left, hsla("+o.h+", 100%, 50%, "+o.a+"), rgba(255, 255, 255, "+o.a+"))\n                    ",a.comparison?a.useAsButton||e._lastColor||(i.preview.lastColor.style.color=u):i.button.style.color=u;var s=o.toHEXA().toString(),l=e._swatchColors,f=Array.isArray(l),p=0;for(l=f?l:l[Symbol.iterator]();;){var v;if(f){if(p>=l.length)break;v=l[p++]}else{if((p=l.next()).done)break;v=p.value}var h=v,d=h.el,g=h.color;d.classList[s===g.toHEXA().toString()?"add":"remove"]("pcr-active")}i.preview.currentColor.style.color=u,e.options.comparison||i.button.classList.remove("clear")}}}),hue:C({lock:"v"===a?"h":"v",element:e._root.hue.picker,wrapper:e._root.hue.slider,onstop:function(){return e._emit("changestop",e)},onchange:function(t){if(r.hue&&r.palette){var n=c();e._recalc&&(n.h=360*t),this.element.style.backgroundColor="hsl("+n.h+", 100%, 50%)",u.palette.trigger()}}}),opacity:C({lock:"v"===i?"h":"v",element:e._root.opacity.picker,wrapper:e._root.opacity.slider,onstop:function(){return e._emit("changestop",e)},onchange:function(t){if(r.opacity&&r.palette){var n=c();e._recalc&&(n.a=Math.round(100*t)/100),this.element.style.background="rgba(0, 0, 0, "+n.a+")",u.palette.trigger()}}}),selectable:P({elements:e._root.interaction.options,className:"active",onchange:function(t){e._representation=t.target.getAttribute("data-type").toUpperCase(),e._recalc&&e._updateOutput()}})};this._components=u},e._bindEvents=function(){var t=this,e=this._root,r=this.options,n=[c(e.interaction.clear,"click",(function(){return t._clearColor()})),c([e.interaction.cancel,e.preview.lastColor],"click",(function(){t._emit("cancel",t),t.setHSVA.apply(t,(t._lastColor||t._color).toHSVA().concat([!0]))})),c(e.interaction.save,"click",(function(){!t.applyColor()&&!r.showAlways&&t.hide()})),c(e.interaction.result,["keyup","input"],(function(e){t.setColor(e.target.value,!0)&&!t._initializingActive&&t._emit("change",t._color),e.stopImmediatePropagation()})),c(e.interaction.result,["focus","blur"],(function(e){t._recalc="blur"===e.type,t._recalc&&t._updateOutput()})),c([e.palette.palette,e.palette.picker,e.hue.slider,e.hue.picker,e.opacity.slider,e.opacity.picker],["mousedown","touchstart"],(function(){return t._recalc=!0}))];if(!r.showAlways){var o=r.closeWithKey;n.push(c(e.button,"click",(function(){return t.isOpen()?t.hide():t.show()})),c(document,"keyup",(function(e){return t.isOpen()&&(e.key===o||e.code===o)&&t.hide()})),c(document,["touchstart","mousedown"],(function(r){t.isOpen()&&!v(r).some((function(t){return t===e.app||t===e.button}))&&t.hide()}),{capture:!0}))}if(r.adjustableNumbers){var i={rgba:[255,255,255,1],hsva:[360,100,100,1],hsla:[360,100,100,1],cmyk:[100,100,100,100]};d(e.interaction.result,(function(e,r,n){var o=i[t.getColorRepresentation().toLowerCase()];if(o){var a=o[n],c=e+(a>=100?1e3*r:r);return c<=0?0:Number((c<a?c:a).toPrecision(3))}return e}))}if(r.autoReposition&&!r.inline){var a=null,u=this;n.push(c(window,["scroll","resize"],(function(){u.isOpen()&&(r.closeOnScroll&&u.hide(),null===a?(a=setTimeout((function(){return a=null}),100),requestAnimationFrame((function t(){u._rePositioningPicker(),null!==a&&requestAnimationFrame(t)}))):(clearTimeout(a),a=setTimeout((function(){return a=null}),100)))}),{capture:!0}))}this._eventBindings=n},e._rePositioningPicker=function(){var t=this.options;if(!t.inline){var e=this._root.app;matchMedia("(max-width: 576px)").matches?Object.assign(e.style,{margin:"auto",height:e.getBoundingClientRect().height+"px",top:0,bottom:0,left:0,right:0}):(Object.assign(e.style,{margin:null,right:null,top:null,bottom:null,left:null,height:null}),this._nanopop.update(t.position))}},e._updateOutput=function(){var t=this._root,e=this._color,r=this.options;if(t.interaction.type()){var n="to"+t.interaction.type().getAttribute("data-type");t.interaction.result.value="function"==typeof e[n]?e[n]().toString(r.outputPrecision):""}!this._initializingActive&&this._recalc&&this._emit("change",e)},e._clearColor=function(t){void 0===t&&(t=!1);var e=this._root,r=this.options;r.useAsButton||(e.button.style.color="rgba(0, 0, 0, 0.15)"),e.button.classList.add("clear"),r.showAlways||this.hide(),this._lastColor=null,this._initializingActive||t||(this._emit("save",null),this._emit("clear",this))},e._parseLocalColor=function(t){var e=j(t),r=e.values,n=e.type,o=e.a,i=this.options.lockOpacity,a=void 0!==o&&1!==o;return r&&3===r.length&&(r[3]=void 0),{values:!r||i&&a?null:r,type:n}},e._emit=function(t){for(var e=this,r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];this._eventListener[t].forEach((function(t){return t.apply(void 0,n.concat([e]))}))},e.on=function(t,e){return"function"==typeof e&&"string"==typeof t&&t in this._eventListener&&this._eventListener[t].push(e),this},e.off=function(t,e){var r=this._eventListener[t];if(r){var n=r.indexOf(e);~n&&r.splice(n,1)}return this},e.addSwatch=function(t){var e=this,r=this._parseLocalColor(t).values;if(r){var n=this._swatchColors,o=this._root,i=k.apply(void 0,r),a=l('<button type="button" style="color: '+i.toRGBA().toString(0)+'" aria-label="color swatch"/>');return o.swatches.appendChild(a),n.push({el:a,color:i}),this._eventBindings.push(c(a,"click",(function(){e.setHSVA.apply(e,i.toHSVA().concat([!0])),e._emit("swatchselect",i),e._emit("change",i)}))),!0}return!1},e.removeSwatch=function(t){var e=this._swatchColors[t];if(e){var r=e.el;return this._root.swatches.removeChild(r),this._swatchColors.splice(t,1),!0}return!1},e.applyColor=function(t){void 0===t&&(t=!1);var e=this._root,r=e.preview,n=e.button,o=this._color.toRGBA().toString(0);return r.lastColor.style.color=o,this.options.useAsButton||(n.style.color=o),n.classList.remove("clear"),this._lastColor=this._color.clone(),this._initializingActive||t||this._emit("save",this._color),this},e.destroy=function(){var t=this;this._eventBindings.forEach((function(t){return u.apply(n,t)})),Object.keys(this._components).forEach((function(e){return t._components[e].destroy()}))},e.destroyAndRemove=function(){var t=this;this.destroy();var e=this._root,r=e.root,n=e.app;r.parentElement&&r.parentElement.removeChild(r),n.parentElement.removeChild(n),Object.keys(this).forEach((function(e){return t[e]=null}))},e.hide=function(){return this._root.app.classList.remove("visible"),this._emit("hide",this),this},e.show=function(){return this.options.disabled||(this._root.app.classList.add("visible"),this._rePositioningPicker(),this._emit("show",this)),this},e.isOpen=function(){return this._root.app.classList.contains("visible")},e.setHSVA=function(t,e,r,n,o){void 0===t&&(t=360),void 0===e&&(e=0),void 0===r&&(r=0),void 0===n&&(n=1),void 0===o&&(o=!1);var i=this._recalc;if(this._recalc=!1,t<0||t>360||e<0||e>100||r<0||r>100||n<0||n>1)return!1;this._color=k(t,e,r,n);var a=this._components,c=a.hue,u=a.opacity,s=a.palette;return c.update(t/360),u.update(n),s.update(e/100,1-r/100),o||this.applyColor(),i&&this._updateOutput(),this._recalc=i,!0},e.setColor=function(t,e){if(void 0===e&&(e=!1),null===t)return this._clearColor(e),!0;var r=this._parseLocalColor(t),n=r.values,o=r.type;if(n){var i=o.toUpperCase(),a=this._root.interaction.options,c=a.find((function(t){return t.getAttribute("data-type")===i}));if(c&&!c.hidden){var u=a,s=Array.isArray(u),l=0;for(u=s?u:u[Symbol.iterator]();;){var f;if(s){if(l>=u.length)break;f=u[l++]}else{if((l=u.next()).done)break;f=l.value}var p=f;p.classList[p===c?"add":"remove"]("active")}}return!!this.setHSVA.apply(this,n.concat([e]))&&this.setColorRepresentation(i)}return!1},e.setColorRepresentation=function(t){return t=t.toUpperCase(),!!this._root.interaction.options.find((function(e){return e.getAttribute("data-type").startsWith(t)&&!e.click()}))},e.getColorRepresentation=function(){return this._representation},e.getColor=function(){return this._color},e.getSelectedColor=function(){return this._lastColor},e.getRoot=function(){return this._root},e.disable=function(){return this.hide(),this.options.disabled=!0,this._root.button.classList.add("disabled"),this},e.enable=function(){return this.options.disabled=!1,this._root.button.classList.remove("disabled"),this},t}();R.utils=n,R.libs={HSVaColor:k,Moveable:C,Nanopop:L,Selectable:P},R.create=function(t){return new R(t)},R.version=g.a;e.default=R}]).default}));

$mx.observe('.screen-sliders', (o) => {
	var list = o.children();
	var direct = o.data('animation');
	if (!direct) direct = 'Up';
	var i = 0;
	
	if (list.length <= 1) return;
	
	let show = () => {
		var a = $mx(list[i]);
		i++;
		if (i > list.length-1) i = 0;
		var b = $mx(list[i]);
		
		list.removeClass('fadeIn'+direct+' fadeOut'+direct+' animated faster');
		list.addClass('is-hidden');

		a.removeClass('is-hidden').addClass('fadeOut'+direct+' animated faster');
		setTimeout(() => {b.removeClass('is-hidden').addClass('fadeIn'+direct+' animated faster');}, 100)
	}
	
	setInterval(show, 3000);
	show();
});

function getRandom(list) {
	var max = list.length;
	return Math.floor(Math.random() * Math.floor(max));
}


$mx.observe('.index-chatbot', (o) => {
	var names = o.data('names').split(',');
	var pages = o.data('pages').split(',');
	var prices = o.data('prices').split(',');
	var labels = o.data('labels').split(',');
	
	var container = o.find('.index-chatbot-container');
	
	function pushMessage() {
		var i = getRandom(pages);
		m = $mx('<div class="index-message is-prepare"><div><b>'+labels[0]+'</b><br>'+labels[1]+': '+names[getRandom(names)]+'<br>'+labels[2]+': '+pages[i]+'<br>'+labels[3]+': '+prices[i]+'</div></div>').appendTo(container);
		
		var height = m.outerHeight()+15;
		container.addClass('is-animated').css('transform', 'translate3d(0, -'+height+'px, 0)');
		m.css({transform: 'translate3d(0, '+height+'px, 0)', opacity: 0}).addClass('is-animated');
		
		let children = container.children();
		
		f = (children.length > 3)?$mx(children.get(0)):null;
		if (f) f.css({transform: 'translate3d(0, 0, 0)', opacity: 1}).addClass('is-animated');
		
		setTimeout(() => {
			m.css({transform: '', opacity: 1});
			if (f) f.css({transform: 'translate3d(0, -'+f.outerHeight()+', 0)', opacity: 0});
			
			setTimeout(() => {
				m.removeClass('is-animated').removeClass('is-prepare');
				container.removeClass('is-animated').css('transform', '');
				if (f) f.remove();
				startNotify();
			}, 300);
		}, 10);
	}
	
	function startNotify() {
		setTimeout(function() {
			pushMessage();
		}, 2000);
	}

	pushMessage();
});

$mx(function() {
	if ($mx('[data-intercom-hash]').length == 0) return;
	var f = $mx('[data-intercom-app]');
	var d = f.data();
	
	function getOptions(f, d) {
		var options = {};
		if (f.length) {

			options.app_id = d.intercomApp;
			options.domain = d.intercomDomain;
			options.language_override = d.intercomLanguage;
			
			if (d.intercomEmail != undefined) {
				options.email = d.intercomEmail;
				options.user_id = d.intercomUid;
				options.nickname = d.intercomNickname;
				options.created_at = d.intercomCreated;
				options.user_hash = d.intercomHash;
				options.followers = d.intercomFollowers;
				
				if (d.intercomPlan) {
					options.plan_name = d.intercomPlan;
					options.upgraded_at = d.intercomPlanUpgraded;
				} else {
					options.plan_name = 'basic';
				}
			}
		}

		return options;	
	}
	
	window.intercomSettings = getOptions(f, d);
	
	window.$events.on('navigate', function(e, to) {
		window.Intercom('update');
	})
	
	window.$events.on('account:refresh', (e, account) => {
		let options = getOptions(f, d);
		options.plan_name = account.tariff;
		options.email = account.user.email;
		options.user_id = account.user.user_id;
		options.user_hash = account.user.hash;
		window.Intercom('update', options);
	});
	
    var w = window;
    var ic = w.Intercom;
	
	$mx.observe('track-event', function(o) {
		w.Intercom('trackEvent', o.data('event'));
	});
	
	$mx(document.body).on('click', '[data-track-event]', function() {
		var o = $mx(this);
		w.Intercom('trackEvent', o.data('track-event'));
	});

    if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update', intercomSettings);
    } else {
        var i = function() {
            i.c(arguments)
        };
        i.q = [];
        i.c = function(args) {
            i.q.push(args)
        };
        w.Intercom = i;
        
        $mx.lazy('//widget.intercom.io/widget/' + d.intercomApp);
    }
});

function scrollIt(destination, direction = 'y', o = null, duration = 300, easing = 'linear', callback) {
	if (o == null) o = window;
	
	function getGlobalOffset(el) {
	    var x = 0, y = 0
	    while (el) {
	        x += el.offsetLeft
	        y += el.offsetTop
	        el = el.offsetParent
	    }
	    return { x: x, y: y }
	}

  const easings = {
    linear(t) {
      return t;
    },
/*
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
*/
  };
  
  
  function getPosition() {
	  return (direction == 'y')?((o != window)?o.scrollTop:o.pageYOffset):((o != window)?o.scrollLeft:o.pageXOffset);
  }

  const start = getPosition();
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  //const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  //const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

  const destinationOffset = Math.max(0, Math.floor( typeof destination === 'number' ? destination : getGlobalOffset(typeof destination == 'string' ? document.querySelector(destination) : destination)[direction] ));
  //const destinationOffsetToScroll = Math.round(destinationOffset - start);
 
  //const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
  if (('requestAnimationFrame' in window === false) || !duration) {
  	if (direction == 'y') {
	    o.scroll(0, destinationOffset);
    } else {
	    o.scroll(destinationOffset, 0);
    }

    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    let v = (timeFunction * (destinationOffset - start)) + start;

    if (direction == 'y') {
	    o.scroll(0, v);
    } else {
	    o.scroll(v, 0);
    }

    if (Math.ceil(Math.floor(v - destinationOffset)) == 0) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}
var scrollwatch = (function() {
	let w = $mx(window);

	let _this = {
		elements: [],
		
		init() {
			$mx.observe('[data-scroll-watch]', (o) => {
				let w = $mx(o.data('scroll-watch'));
				if (w.length) this.elements.push({o: o, d: o.data(), w: w});
			});

			w.on('resize orientationchange scroll', _this.check);
			this.check();
		},
		
		check() {
			const scrollY = window.scrollY;
			const visible = document.documentElement.clientHeight;
			const pageHeight = document.documentElement.scrollHeight;
			
			for (i = 0; i < _this.elements.length; i++) {
				let e = _this.elements[i];
				if (e.d.scrollWatchClass != undefined) {
					let c = e.d.scrollWatchClass;
					let v = (scrollY < e.w.offset().top);
					
					if (c.substr(0, 4) == 'not:') {
						c = c.substr(4);
						v != v;
					}
					
					e.o.toggleClass(c, v);
				}
			}
		}
	};
	
	_this.init();
	
	return _this;
})();
window.vue_components = {};
window.vue_modules = {};
window.modules = {};

if (window.Vue == undefined) {
	Vue = {
		component: function(name, options) {
			window.vue_components[name] = options;
		}
	}
	
	window.defineModule = function(name, options) {
		window.modules[name] = options;
		window.vue_modules[name] = options;
	}
}

$mx.observe('.vue:not(.vue-inited)', function(o) {
	o.addClass('vue-inited');
	
    var m = /^vue\-([^-]+)/ig;
    var tag = this.tagName.toLowerCase();
	if (window.$locale) i18n.init(window.$locale);
    
	App.defineModuleComplete();
    
    var t = m.exec(tag);
    if (t) {
	    var module = t[1];
		if (window.modules_loaded[module] == undefined) {
			window.modules_loaded[module] = true;
			Vue.component(tag, function(resolve) {
				window.components_hooks[tag] = resolve;
				$mx.lazy('/s/js/vue.'+module+'.js', '/s/css/vue.'+module+'.css');
/*
			    var link = document.createElement('link');
			    link.href = '/s/css/vue.'+module+'.css'+scriptsVersion;
			    link.type = 'text/css';
			    link.rel = 'stylesheet';
			    document.body.appendChild(link);	
				
				var script = document.createElement('script');
			    script.src = '/s/js/vue.'+module+'.js'+scriptsVersion;
			    script.async = true;
				document.body.appendChild(script);  
*/
				
			});
		}
		
		// Загружаем VUE если его нет
	    if (window.Vue == undefined) {
			var waiting = $mx('<div class="waiting waiting-blue waiting-block" style="margin:50px auto"></div>').appendTo(o);
		    $mx.lazy('app.js');
	    } else {
		    if (window.account != undefined) {
			    Vue.prototype.$auth.refresh(window.account);
			    window.$vue = new Vue(window.vue_options).$mount(o.parent()[0]);
		    } else {
		    		Vue.prototype.$api.get('account/get').then((data) => {
					Vue.prototype.$auth.refresh(data.response);
					window.$vue = new Vue(window.vue_options).$mount(o.parent()[0]);
				});
			}
	    }
	} else {
		window.$vue = new Vue(window.vue_options).$mount(o[0]);
	}

    
	$mx('#loading-global').remove();
});
