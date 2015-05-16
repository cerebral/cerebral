"use strict";
var utils = require('./../utils.js');

var createMapMethod = function(store, maps, helpers) {

  return function(path, description) {

    var prevResult = null;
    var state = null;
    var depPaths = description.deps;
    var callback = description.get;
    var deps = depPaths;
    path = (typeof path === 'string' ? [path] : path).slice();
    depPaths = depPaths.concat(path);

    var grabState = function() {
      return depPaths.reduce(function(state, path) {
        state[path] = utils.getPath(path, helpers.currentState);
        return state;
      }, {});
    };

    var update = function() {
      var newState = grabState();
      state = state || newState;
      var hasChanged = Object.keys(newState).reduce(function(hasChanged, key) {
        if (hasChanged) {
          return hasChanged;
        }
        return state[key] !== newState[key];
      }, false);

      if (hasChanged || !prevResult) {
        state = newState;
        var depsState = utils.convertDepsToState(deps, helpers.currentState);
        prevResult = callback(store, depsState, utils.getPath(path, helpers.currentState));
        setValue(prevResult);
      } else {
        setValue(prevResult);
      }
    };

    var setValue = function(value) {
      var mapPath = maps;
      var pathCopy = path.slice();
      while (pathCopy.length) {
        mapPath = mapPath[pathCopy.shift()] = pathCopy.length ? {} : value;
      }
    };

    setValue(description.value);

    store.on('mapUpdate', update);
    helpers.mapCallbacks.push(update);

  };

};

module.exports = createMapMethod;
