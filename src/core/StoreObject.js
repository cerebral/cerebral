'use strict';
var utils = require('./../utils.js');

var StoreObjectProto = {
  set: function(key, value) {

    return this.__.update(this.__.path, function(obj, helpers, traverse) {

      // If an array is set there might be immutable objects in it that needs
      // a path update
      if (Array.isArray(value)) {
        value.forEach(function(item, index) {
          if (item.__) {
            item.__.path[item.__.path.length - 1] = index;
          }
        });
      }
      helpers.currentPath.push(key);
      obj[key] = traverse(helpers, value);
      helpers.currentPath.pop();

    });
  },
  toJS: function() {
    return utils.toJS(this);
  },
  merge: function(mergeObj) {
    if (Array.isArray(mergeObj) || typeof mergeObj !== 'object' || mergeObj === null) {
      throw new Error('You have to pass an object to the merge method');
    }
    return this.__.update(this.__.path, function(obj, helpers, traverse) {
      Object.keys(mergeObj).forEach(function(key) {
        helpers.currentPath.push(key);
        obj[key] = traverse(helpers, mergeObj[key]);
        helpers.currentPath.pop();
      });
    });
  },
  getPath: function() {
    return this.__.path.slice();
  }
};

module.exports = function(props, helpers) {
  var object = Object.create(StoreObjectProto);
  Object.keys(props).forEach(function(key) {
    object[key] = props[key];
  });
  Object.defineProperty(object, '__', {
    value: {
      path: helpers.currentPath.slice(0),
      update: helpers.update,
      eventStore: helpers.eventStore
    }
  });
  return object;
};
