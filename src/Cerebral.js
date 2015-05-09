'use strict';

/*
  TODO:
    - [OPTIMIZE] If setting the same value, avoid doing extra work
    - facets hook onto existing state
*/
var utils = require('./utils.js');
var React = require('react');
var EventEmitter = require('events').EventEmitter;
var traverse = require('./core/traverse.js');
var StoreObject = require('./core/StoreObject.js');
var createHelpers = require('./core/createHelpers.js');
var createSignalMethod = require('./core/createSignalMethod.js');
var createFacetMethod = require('./core/createFacetMethod.js');
var createMutationMethods = require('./core/createMutationMethods.js');

function Cerebral(state) {

  if (!state || (typeof state !== 'object' || Array.isArray(state) || state === null)) {
    throw new Error('You have to pass an object to the cerebral');
  }


  var emitter = new EventEmitter();
  var cerebral = Object.create(emitter);
  var helpers = createHelpers(state, cerebral);
  var facets = {};

  cerebral.signals = {};
  
  cerebral.signal = createSignalMethod(helpers, cerebral);
  cerebral.facet = createFacetMethod(cerebral, facets, helpers);

  cerebral.hasExecutingAsyncSignals = function () {
    return helpers.eventStore.hasExecutingAsyncSignals;
  };

  cerebral.injectInto = function (component) {
    return React.createClass({
      childContextTypes: {
        cerebral: React.PropTypes.object
      },
      getChildContext: function () {
        return {
          cerebral: cerebral
        };
      },
      render: function () {
        return React.createElement(component, this.props);
      }
    });
  };

  // Go back in time
  cerebral.remember = function(index) {
    return helpers.currentState.__.eventStore.travel(index, helpers.currentState);
  };

  // Get signals and mutations done to cerebral
  cerebral.getMemories = function() {
    return {
      signals: helpers.currentState.__.eventStore.signals.slice(0),
      mutations: helpers.currentState.__.eventStore.mutations.slice(0)
    };
  };

  cerebral.get = function(path) {
    if (!path) {
      throw new Error('You have to pass a path to the get method');
    }
    if (typeof path === 'string') {
      path = [].slice.call(arguments);
    }
    
    var facetPath = utils.getFacetPath(path, facets);
    if (facetPath) {
      return facetPath();
    }
    return utils.getPath(path, helpers.currentState);
  };

  createMutationMethods(helpers, cerebral);

  return cerebral;

}


module.exports = Cerebral;
