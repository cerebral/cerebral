"use strict";
var utils = require('./../utils.js');

var createFacetMethod = function(store, facets, helpers) {

  return function(path, depPaths, callback) {
    
    var prevResult = null;
    path = typeof path === 'string' ? [path] : path;
    depPaths = depPaths.concat(path);

    var grabState = function() {
      return depPaths.reduce(function(state, path) {
        state[path] = utils.getPath(path, helpers.currentState);
        return state;
      }, {});
    };

    var state = grabState();

    var update = function() {
      var newState = grabState();
      var hasChanged = Object.keys(newState).reduce(function(hasChanged, key) {
        if (hasChanged) {
          return hasChanged;
        }
        return state[key] !== newState[key];
      }, false);

      if (hasChanged || !prevResult) {
        state = newState;
        prevResult = callback(store, utils.getPath(path, helpers.currentState));
        return prevResult;
      } else {
        return prevResult;
      }
    };

    var facetPath = facets;
    var pathCopy = path.slice();
    while(pathCopy.length) {
      facetPath = facetPath[pathCopy.shift()] = pathCopy.length ? {} : update;
    }
  
  };

};

module.exports = createFacetMethod;
