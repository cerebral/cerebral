'use strict';

/*
  TODO:
    - [OPTIMIZE] If setting the same value, avoid doing extra work
    - Freeze data returned from facets? what about arrays with objects?  
    - Allow object in state function deps
    - Comment all code
    - Do not record when in production
    - More tests! reset, async travelling...
    - Fix bug where toggling record/not record
    - Display error in debugger when promise fails
    - How to trigger signals correctly as async singals are running?
*/
var utils = require('./utils.js');
var React = require('react');
var EventEmitter = require('events').EventEmitter;
var traverse = require('./core/traverse.js');
var StoreObject = require('./core/StoreObject.js');
var createHelpers = require('./core/createHelpers.js');
var createSignalMethod = require('./core/createSignalMethod.js');
var createMapMethod = require('./core/createMapMethod.js');
var createMutationMethods = require('./core/createMutationMethods.js');
var createRefMethods = require('./core/createRefMethods.js');
var CerebralDebugger = React.createFactory(require('./Debugger.js'));
var createStore = require('./core/createStore.js');

function Cerebral(initialState) {

  var state = {};
  var localStorageState = utils.hasLocalStorage() && localStorage.getItem('cerebral_state') ?
    JSON.parse(localStorage.getItem('cerebral_state')) : {};

  state = utils.applyObjectDiff(state, initialState);
  state = utils.applyObjectDiff(state, localStorageState);

  if (!state || (typeof state !== 'object' || Array.isArray(state) || state === null)) {
    throw new Error('You have to pass an object to the cerebral');
  }

  var emitter = new EventEmitter();
  var cerebral = Object.create(emitter);
  var helpers = createHelpers(initialState, cerebral);
  var maps = {};
  var refIds = {};
  var map = createMapMethod(cerebral, maps, helpers);

  helpers.onFunction = function(path, func) {
    var description = func();
    map(path, description);
    return description.value;
  };

  helpers.currentState = createStore(helpers, state);

  cerebral.signals = {};

  cerebral.signal = createSignalMethod(helpers, cerebral);

  cerebral.hasExecutingAsyncSignals = function() {
    return helpers.eventStore.hasExecutingAsyncSignals;
  };

  cerebral.injectInto = function(component) {

    // Set store in correct state
    try {
      helpers.eventStore.rememberNow(helpers.currentState);
    } catch (e) {
      helpers.eventStore.reset(helpers.currentState);
      alert('Cerebral was unable to remember your state, probably due to an incompatible change in the code. State has been reset and application will reload!')
      return location.reload();

    }

    var Wrapper = React.createClass({
      childContextTypes: {
        cerebral: React.PropTypes.object
      },
      getChildContext: function() {
        return {
          cerebral: cerebral
        };
      },
      render: function() {

        if (process.env.NODE_ENV === 'production') {
          return React.createElement(component, this.props);
        } else {
          return React.DOM.div(null,
            React.DOM.div({
              style: {
                paddingRight: '400px'
              }
            }, React.createElement(component, this.props)),
            CerebralDebugger()
          );
        }
      }
    });

    return Wrapper;
  };

  // Go back in time
  cerebral.remember = function(index) {
    helpers.nextRef = 0;
    helpers.nextSignal = 0;
    helpers.refs = [];
    helpers.ids = [];
    refIds = {};
    return helpers.eventStore.travel(index, helpers.currentState);
  };

  // Get signals and mutations done to cerebral
  cerebral.getMemories = function() {
    return helpers.eventStore.signals.slice(0);
  };

  cerebral.getMemoryIndex = function() {
    return helpers.eventStore.currentIndex;
  };

  cerebral.toggleKeepState = function() {
    helpers.eventStore.toggleKeepState();
  };

  cerebral.willKeepState = function() {
    return helpers.eventStore.willKeepState;
  };

  cerebral.extractState = function() {
    return helpers.currentState.toJS();
  };

  cerebral.ref = createRefMethods(helpers);

  cerebral.reset = function() {
    helpers.nextRef = 0;
    helpers.currentSignal = 0;
    helpers.asyncCallbacks = {};
    helpers.refs = [];
    helpers.ids = [];
    refIds = {};
    helpers.eventStore.reset(helpers.currentState);
  };

  cerebral.get = function(path) {
    if (!path) {
      throw new Error('You have to pass a path to the get method');
    }
    if (typeof path === 'string') {
      path = [].slice.call(arguments);
    }

    var mapValue = utils.getMapPath(path, maps);
    if (mapValue) {
      return mapValue[0];
    }

    return utils.getPath(path, helpers.currentState);
  };

  createMutationMethods(helpers, cerebral);

  if (global.addEventListener) {

    window.addEventListener('beforeunload', function() {
      if (!utils.hasLocalStorage()) {
        return;
      }

      if (helpers.eventStore.willKeepState) {
        localStorage.setItem('cerebral_state', JSON.stringify(helpers.eventStore.initialState));
        localStorage.setItem('cerebral_signals', JSON.stringify(helpers.eventStore.signals));
        localStorage.setItem('cerebral_asyncCallbacks', JSON.stringify(helpers.asyncCallbacks));
      } else {
        localStorage.removeItem('cerebral_state');
        localStorage.removeItem('cerebral_signals');
        localStorage.removeItem('cerebral_asyncCallbacks');
      }
      localStorage.setItem('cerebral_keepState', helpers.eventStore.willKeepState.toString());
    });

  }

  return cerebral;

}


module.exports = Cerebral;
