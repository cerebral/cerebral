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
    path = typeof path === 'string' ? [path] : path
    path = path.slice();
    var currentPath = state;
    while (path.length) {
      var key = path.shift();
      if (key.__ && key.__.path) {
        path = key.__.path.concat(path);
        continue;
      }
      currentPath = currentPath[key];
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
  }
};

module.exports = utils;
