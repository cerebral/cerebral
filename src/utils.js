"use strict";
var utils = {
  toJS: function(obj) {
    if (obj instanceof Array) {
      return obj.map(function(obj) {
        return utils.toJS(obj);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce(function(newObj, key) {
        newObj[key] = utils.toJS(obj[key]);
        return newObj;
      }, {});
    } else {
      return obj;
    }
  },
  getPath: function(path, state) {

    var originalPath = path.slice();
    path = typeof path === 'string' ? [path] : path.slice();

    var currentPath = state;
    try {

      while (path.length) {
        var key = path.shift();
        if (key.__ && key.__.path) {
          path = key.__.path.concat(path);
          continue;
        }
        currentPath = currentPath[key];
      }

    } catch (e) {
      throw new Error('The path ' + JSON.stringify(originalPath) + ' is not a valid cerebral path');
    }
    return currentPath;
  },
  isObject: function(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
  },
  shallowEqual: function(objA, objB) {
    if (objA === objB) {
      return true;
    }
    if (!objA || !objB) {
      return false;
    }

    var key;
    // Test for A's keys different from B.
    for (key in objA) {
      if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
        return false;
      }
    }
    // Test for B's keys missing from A.
    for (key in objB) {
      if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  },
  getMapPath: function(path, facets) {

    // No facets if no path
    if (!path.length) {
      return;
    }

    var currentPath = facets;
    path = path.slice();
    while (currentPath && path.length) {
      currentPath = currentPath[path.shift()];
    }

    return currentPath && !path.length ? currentPath : null;

  },
  isPromise: function(value) {
    return !!(value && value.then && typeof value.then === 'function');
  },
  getFunctionName: function(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  },
  setWithPath: function(target, path, value) {
    while (path.length) {
      if (path.length === 1) {
        target[path.shift()] = value;
      } else {
        target = target[path.shift()];
      }
    }
  },
  hasLocalStorage: function() {
    return typeof global.localStorage !== 'undefined';
  },
  applyObjectDiff: function(targetObject, sourceObject) {

    var currentPath = [];

    var analyze = function(key, value) {
      currentPath.push(key);
      var path = utils.getPath(currentPath, targetObject);
      if (!path) {
        utils.setWithPath(targetObject, currentPath, value);
      } else {
        traverse(value);
      }
      currentPath.pop();
    };

    var traverse = function(obj) {

      if (Array.isArray(obj)) {
        obj.forEach(function(value, index) {
          analyze(index, value);
        });
      } else if (utils.isObject(obj)) {
        Object.keys(obj).forEach(function(key) {
          analyze(key, obj[key]);
        });
      }

      return targetObject;

    };
    return traverse(sourceObject);
  },

  // Converts an array of paths to key/value
  pathsToObject: function(obj) {
    if (!Array.isArray(obj)) {
      return obj;
    }
    return obj.reduce(function(obj, value) {
      obj[typeof value === 'string' ? value : value.slice().pop()] = value;
      return obj;
    }, {})
  },

  // Converts an object to array of paths
  objectToPaths: function(obj) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },
  extend: function() {
    var objects = [].slice.call(arguments);
    var initialObject = objects.shift();
    return objects.reduce(function(returnedObject, object) {
      return Object.keys(object).reduce(function(returnedObject, key) {
        returnedObject[key] = object[key];
        return returnedObject;
      }, returnedObject);
    }, initialObject);
  },
  getSignalPath: function(currentPath, stringPath) {
    
    var path = stringPath.split('.');
    var key = path.pop();

    while (path.length) {
      var nestedKey = path.shift();
      currentPath[nestedKey] = currentPath[nestedKey] || {};
      currentPath = currentPath[nestedKey];
    }
    
    return {
      path: currentPath,
      key: key
    };
  }
};

module.exports = utils;
