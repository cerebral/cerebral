"use strict";

var StoreObject = require('./StoreObject.js');
var StoreArray = require('./StoreArray.js');

var traverse = function(helpers, value) {
  if (Array.isArray(value) && !value.__) {
    var array = value.map(function(item, index) {
      helpers.currentPath.push(index);
      var obj = traverse(helpers, item);
      helpers.currentPath.pop();
      return obj;
    });
    var storeArray = StoreArray(array, helpers);
    Object.freeze(storeArray);
    return storeArray;
  } else if (typeof value === 'object' && value !== null && !value.__) {
    var object = Object.keys(value).reduce(function(object, key) {
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

module.exports = traverse;