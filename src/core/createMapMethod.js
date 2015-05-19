"use strict";
var utils = require('./../utils.js');

var createMapMethod = function(store, maps, helpers) {

  return function(path, description) {

    path = (typeof path === 'string' ? [path] : path).slice();

    var prevResult = null;
    var state = null;
    var callback = description.get;
    var values = [];

    // Convert deps to key/value to expose state
    var depPathsObject = utils.pathsToObject(description.deps);

    // Convert deps + state path to array to use for state retrieval and equality check
    var allPaths = utils.objectToPaths(description.deps).concat(path);

    // Get all depending state values
    var grabState = function() {
      return allPaths.map(function(path) {
        return utils.getPath(path, helpers.currentState);
      });
    };

    // Update map if necessary
    var update = function() {

      // Grab latest values
      var newState = grabState();

      // Set state if this is first iteration
      state = state || newState;

      // Filter out changes
      var hasChanged = newState.filter(function(newState, index) {
        return state[index] !== newState;
      });

      // If first run or has any changes grab latest dep values and
      // run the map
      if (hasChanged.length || !prevResult) {
        state = newState;
        var depsState = Object.keys(depPathsObject).reduce(function (state, key) {
          state[key] = utils.getPath(depPathsObject[key], helpers.currentState);
          return state;
        }, {});
        prevResult = callback(store, depsState, utils.getPath(path, helpers.currentState));
        setValue(prevResult);
      }
    };

    var setValue = function(value) {

      values.unshift(value);

      // When remembering subsignals that are async we need to reverse the values
      // as the async value should be picked instea
      if (!!helpers.subSignal && store.isRemembering) {
        values.reverse();
      }

    };

    var mapPath = maps;
    var pathCopy = path.slice();
    while (pathCopy.length) {
      mapPath = mapPath[pathCopy.shift()] = pathCopy.length ? {} : values;
    }

    setValue(description.value);

    store.on('mapUpdate', update);

    helpers.mapUpdates.push(update);

  };

};

module.exports = createMapMethod;
