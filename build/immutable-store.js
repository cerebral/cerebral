(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Store"] = factory();
	else
		root["Store"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var StoreArray = __webpack_require__(1);
	var StoreObject = __webpack_require__(2);

	var unfreeze = function (value, helpers) {
	  if (Array.isArray(value)) {
	    return StoreArray(value, helpers);
	  } else if (typeof value === 'object' && value !== null) {
	    return StoreObject(value, helpers);
	  } else {
	    return value;
	  }
	};

	var traverse = function (helpers, value) {
	  if (Array.isArray(value) && !value.__) {
	    var array = value.map(function (item, index) {
	      helpers.currentPath.push(index);
	      var obj = traverse(helpers, item);
	      helpers.currentPath.pop();
	      return obj;
	    });
	    var storeArray = StoreArray(array, helpers);
	    Object.freeze(storeArray);
	    return storeArray;
	  } else if (typeof value === 'object' && value !== null && !value.__) {
	    var object = Object.keys(value).reduce(function (object, key) {
	      helpers.currentPath.push(key);
	      object[key] = traverse(helpers, value[key]);
	      helpers.currentPath.pop();
	      return object;
	    }, {});
	    var storeObject = StoreObject(object, helpers);
	    Object.freeze(storeObject);
	    return storeObject;
	  } else {
	    return value;
	  }
	};

	var updatePath = function (helpers, path, cb) {

	  helpers.currentPath = [];

	  // Unfreeze the store, ready for traversal
	  var newStore = unfreeze(helpers.currentStore, helpers);
	  var destination = newStore;

	  // Go through path in need of update and unfreeze along the
	  // way to update any props
	  path.forEach(function (pathKey) {
	    helpers.currentPath.push(pathKey);
	    destination[pathKey] = unfreeze(destination[pathKey], helpers);
	    destination = destination[pathKey];
	  });

	  // Run the update
	  cb(destination, helpers, traverse);

	  // Get ready for new traversal to freeze all
	  // paths
	  destination = newStore;
	  path.forEach(function (pathKey) {
	    destination = destination[pathKey];
	    Object.freeze(destination);
	  });

	  // Make ready a new store with its special
	  // domain getters, then freeze it
	  var store = {};
	  Object.keys(newStore).forEach(function (key) {
	    Object.defineProperty(store, key, {
	      enumerable: true,
	      get: function () {
	        helpers.currentStore = this;
	        return newStore[key];
	      }
	    });
	  });
	  Object.freeze(store);

	  return store;
	};

	var createStore = function (helpers, state) {
	  var store = {};
	  Object.keys(state).forEach(function (key) {
	    helpers.currentPath.push(key);
	    var branch = traverse(helpers, state[key]);
	    helpers.currentPath.pop(key);
	    Object.defineProperty(store, key, {
	      enumerable: true,
	      get: function () {
	        helpers.currentStore = this;
	        return branch;
	      }
	    });
	  });
	  Object.freeze(store);
	  return store;
	};

	function Store(state) {

	  if (!state || (typeof state !== 'object' || Array.isArray(state) || state === null)) {
	    throw new Error('You have to pass an object to the store');
	  }

	  var helpers = {
	    currentPath: [],
	    currentStore: null,
	    update: function (path, cb) {
	      helpers.currentStore = updatePath(helpers, path, cb);
	      return helpers.currentStore;
	    }
	  };

	  helpers.currentStore = createStore(helpers, state);
	  return helpers.currentStore;

	}

	module.exports = Store;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var StoreArray = function () {

	  function StoreArray(items) {
	    var inst = Array.apply(Array, items);
	    inst.__proto__ = StoreArray.prototype;
	    return inst;
	  }
	  StoreArray.prototype = Object.create(Array.prototype);
	  StoreArray.prototype.push = function (item) {
	    return this.__.update(this.__.path, function (obj, helpers, traverse) {
	      helpers.currentPath.push(obj.length);
	      Array.prototype.push.call(obj, traverse(helpers, item));
	    });
	  };
	  StoreArray.prototype.splice = function () {
	    var args = [].slice.call(arguments, 0);
	    var startIndex = args.shift();
	    var count = args.shift();
	    return this.__.update(this.__.path, function (obj, helpers, traverse) {

	      var additions = args.map(function (arg, index) {
	        helpers.currentPath.push(startIndex + index);
	        var addition = traverse(helpers, arg);
	        helpers.currentPath.pop();
	        return addition;
	      });

	      Array.prototype.splice.apply(obj, [startIndex, count].concat(additions));

	      // Update paths
	      for (var x = startIndex; x < obj.length; x++) {
	        if (obj[x].__) {
	          var path = obj[x].__.path;
	          path[path.length - 1] = x;
	        }
	      }

	    });
	  };
	  StoreArray.prototype.concat = function () {
	    var args = [].slice.call(arguments, 0);
	    return this.__.update(this.__.path, function (obj, helpers, traverse) {
	      args.map(function (arg) {
	        if (Array.isArray(arg)) {
	          arg.map(function (deepArg) {
	            helpers.currentPath.push(obj.length);
	            Array.prototype.push.call(obj, traverse(helpers, deepArg));
	            helpers.currentPath.pop();
	          });
	        } else {
	          helpers.currentPath.push(obj.length);
	          Array.prototype.push.call(obj, traverse(helpers, arg));
	          helpers.currentPath.pop();
	        }
	      });
	    });
	  };
	  StoreArray.prototype.unshift = function (item) {
	    return this.__.update(this.__.path, function (obj, helpers, traverse) {
	      Array.prototype.unshift.call(obj, traverse(helpers, item));

	      // Update paths
	      for (var x = 0; x < obj.length; x++) {
	        if (obj[x].__) {
	          var path = obj[x].__.path;
	          path[path.length - 1] = x;
	        }
	      }

	    });
	  };
	  StoreArray.prototype.shift = function (item) {
	    return this.__.update(this.__.path, function (obj, helpers, traverse) {
	      Array.prototype.shift.call(obj, traverse(helpers, item));

	      // Update paths
	      for (var x = 0; x < obj.length; x++) {
	        if (obj[x].__) {
	          var path = obj[x].__.path;
	          path[path.length - 1] = x;
	        }
	      }

	    });
	  };
	  StoreArray.prototype.pop = function () {
	    return this.__.update(this.__.path, function (obj) {
	      Array.prototype.pop.call(obj);
	    });
	  };

	  return function (items, helpers) {
	    var array = new StoreArray(items);
	    Object.defineProperty(array, '__', {
	      value: {
	        path: helpers.currentPath.slice(0),
	        update: helpers.update
	      }
	    });
	    return array;
	  };

	};

	module.exports = StoreArray();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var StoreObject = function () {

	  var StoreObjectProto = {
	    set: function (key, value) {
	      return this.__.update(this.__.path, function (obj, helpers, traverse) {
	        
	        // If an array is set there might be immutable objects in it that needs
	        // a path update
	        if (Array.isArray(value)) {
	          value.forEach(function (item, index) {
	            if (item.__) {
	              item.__.path[item.__.path.length - 1] = index;
	            }
	          });
	        }

	        obj[key] = traverse(helpers, value);
	      });
	    }
	  };

	  return function (props, helpers) {
	    var object = Object.create(StoreObjectProto);
	    Object.keys(props).forEach(function (key) {
	      object[key] = props[key];
	    });
	    Object.defineProperty(object, '__', {
	      value: {
	        path: helpers.currentPath.slice(0),
	        update: helpers.update
	      }
	    });
	    return object;
	  };

	};

	module.exports = StoreObject();


/***/ }
/******/ ])
});
