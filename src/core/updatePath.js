"use strict";

var utils = require('./../utils.js');
var StoreObject = require('./StoreObject.js');
var unfreeze = require('./unfreeze.js');
var traverse = require('./traverse.js');

var updatePath = function(helpers, path, cb) {

  helpers.currentPath = [];

  // Unfreeze the store, ready for traversal
  var newStore = unfreeze(helpers.currentState, helpers);
  var destination = newStore;

  // Go through path in need of update and unfreeze along the
  // way to update any props
  path.forEach(function(pathKey) {
    helpers.currentPath.push(pathKey);
    destination[pathKey] = unfreeze(destination[pathKey], helpers);
    destination = destination[pathKey];
  });

  // Run the update
  cb(destination, helpers, traverse);

  // Get ready for new traversal to freeze all paths
  destination = newStore;
  path.forEach(function(pathKey) {
    destination = destination[pathKey];
    Object.freeze(destination);
    helpers.currentPath.pop();
  });

  // Make ready a new store and freeze it
  var store = StoreObject(newStore, helpers);
  Object.keys(newStore).forEach(function(key) {
    Object.defineProperty(store, key, {
      enumerable: true,
      get: function() {
        helpers.currentState = this;
        return newStore[key];
      }
    });
  });
  Object.freeze(store);
  return store;
};

module.exports = updatePath;