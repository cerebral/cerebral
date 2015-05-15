"use strict";

var EventStore = require('./../EventStore.js');
var updatePath = require('./updatePath.js');

var createHelpers = function(state, store) {
  
  var helpers = {
    currentPath: [],
    currentState: null,
    update: function(path, cb) {
      helpers.currentState = updatePath(helpers, path, cb);
      return helpers.currentState;
    },
    eventStore: new EventStore(state, store),
    nextRef: 0,
    nextSignal: 0,
    currentSignal: 0,
    onFunction: null
  };

  return helpers;

};

module.exports = createHelpers;
