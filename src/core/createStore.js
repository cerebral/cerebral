"use strict";

var traverse = require('./traverse.js');
var StoreObject = require('./StoreObject.js');

var createStore = function(helpers, state) {

  var store = StoreObject({}, helpers);
  Object.keys(state).forEach(function(key) {
    helpers.currentPath.push(key);
    var branch = traverse(helpers, state[key]);
    helpers.currentPath.pop(key);
    Object.defineProperty(store, key, {
      enumerable: true,
      get: function() {
        helpers.currentState = this;
        return branch;
      }
    });
  });
  Object.freeze(store);
  return store;
};

module.exports = createStore;