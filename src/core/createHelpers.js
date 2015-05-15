"use strict";

var EventStore = require('./../EventStore.js');
var updatePath = require('./updatePath.js');

var createHelpers = function(state, store) {
  
  var eventStore = new EventStore(state, store);

  var helpers = {
    currentPath: [],
    currentState: null,
    update: function(path, cb) {
      helpers.currentState = updatePath(helpers, path, cb);
      return helpers.currentState;
    },
    eventStore: eventStore,
    nextRef: 0,
    currentSignal: eventStore.currentIndex,
    onFunction: null,
    asyncCallbacks: localStorage.getItem('cerebral_asyncCallbacks') ? 
      JSON.parse(localStorage.getItem('cerebral_asyncCallbacks')) : 
      {}
  };

  return helpers;

};

module.exports = createHelpers;
