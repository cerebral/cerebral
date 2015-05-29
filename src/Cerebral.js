'use strict';

/*
  TODO:
    - [OPTIMIZE] If setting the same value, avoid doing extra work
    - Comment all code
    - More tests! reset, async travelling...
    - Display error in debugger when promise fails
    - How to trigger signals correctly as async singals are running?
*/
var utils = require('./utils.js');

var EventEmitter = require('events').EventEmitter;
var traverse = require('./core/traverse.js');
var StoreObject = require('./core/StoreObject.js');
var createHelpers = require('./core/createHelpers.js');
var createSignalMethod = require('./core/createSignalMethod.js');
var createMapMethod = require('./core/createMapMethod.js');
var createMutationMethods = require('./core/createMutationMethods.js');
var createRefMethods = require('./core/createRefMethods.js');
var createStore = require('./core/createStore.js');
var createInjector = require('./core/createInjector.js');
var Recorder = require('./Recorder.js');

// The Cerebral instance
function Cerebral(initialState) {

  // Add recorder to initial state
  initialState.recorder = {
    isPlaying: false,
    isRecording: false,
    hasRecording: false
  };

  // The actual state object which will be used on instance
  var state = {};

  // If localStorage is available we try to grab any state stored there
  var localStorageState = utils.hasLocalStorage() && localStorage.getItem('cerebral_state') ?
    JSON.parse(localStorage.getItem('cerebral_state')) : {};

  // We apply any diffs from the passed initial state. This ensures that if you add properties
  // to the initial state and save, these will be avilable 
  state = utils.applyObjectDiff(state, initialState);

  // Then we apply any changes from the state in localStorage
  state = utils.applyObjectDiff(state, localStorageState);

  // Using default Node EventEmitter
  var emitter = new EventEmitter();

  // Use emitter as prototype
  var cerebral = Object.create(emitter);

  // Helpers is an object being passed around to share state
  var helpers = createHelpers(initialState, cerebral);

  // Maps will contain the latest calculated values of state maps
  var maps = {};

  // The method that create maps
  var map = createMapMethod(cerebral, maps, helpers);

  // When the initial state is traversed by immutable-store this function will
  // trigger when it meets a function. In our case it creates a map and returns
  // the value to replace the function
  helpers.onFunction = function(path, func) {
    var description = func();
    map(path, description);
    return description.initialState;
  };

  // Creates the immutable-store
  helpers.currentState = createStore(helpers, state);

  helpers.recorder = new Recorder(cerebral, helpers);

  // Placeholder for the signals
  cerebral.signals = {};

  // The method that creates the signals
  cerebral.signal = createSignalMethod(helpers, cerebral);

  // Handy for Debugger etc. to verify if any async signals are running
  cerebral.hasExecutingAsyncSignals = function() {
    return helpers.eventStore.hasExecutingAsyncSignals;
  };

  // Method to create a wrapper component exposing the cerebral and debugger.
  // It also remembers current state, but will reset and reload page if anything
  // wrong happens. This typically happens when the cerebral is unable to handle
  // the state stored in localStorage
  cerebral.injectInto = createInjector(cerebral, helpers);

  // The method that resets cerebral helper state and runs the travel method
  // of EventStore
  cerebral.remember = function(index) {
    helpers.nextRef = 0;
    helpers.nextSignal = 0;
    helpers.refs = [];
    helpers.ids = [];
    return helpers.eventStore.travel(index, helpers);
  };

  // Get signals form EventStore
  cerebral.getMemories = function() {
    return helpers.eventStore.signals.slice(0);
  };

  // Get current signal index
  cerebral.getMemoryIndex = function() {
    return helpers.eventStore.currentIndex;
  };

  // Toggle if the EventStore should keep previous
  // signals
  cerebral.toggleKeepState = function() {
    helpers.eventStore.toggleKeepState();
  };

  // Check if the EventStore is keeping previous signals
  cerebral.willKeepState = function() {
    return helpers.eventStore.willKeepState;
  };

  // Toggle if the EventStore should store state
  // in local storage
  cerebral.toggleStoreState = function() {
    helpers.eventStore.toggleStoreState();
  };

  cerebral.getRecording = function () {
    return helpers.recorder.currentRecording;
  };

  // Check if the EventStore will store its state in localStorage
  cerebral.willStoreState = function() {
    return helpers.eventStore.willStoreState;
  };

  // Extracts all the state of the application. Used to put into
  // localStorage
  cerebral.toJS = function() {
    return helpers.currentState.toJS();
  };

  // Cleans up all state and adds new state
  cerebral.wash = function(newState) {

    // First remove all state, as some code might have added
    // new props
    Object.keys(state).forEach(function(key) {
      helpers.currentState = helpers.currentState.unset(key);
    });

    // Now set the initial state
    // TODO: Should this do the same object diffing?
    Object.keys(newState).forEach(function(key) {
      helpers.currentState = helpers.currentState.set(key, newState[key]);
    });

  };

  cerebral.ref = createRefMethods(helpers);

  // Resets any helpers state and resets the EventStore
  cerebral.reset = function() {
    helpers.nextRef = 0;
    helpers.currentSignal = 0;
    helpers.asyncCallbacks = {};
    helpers.refs = [];
    helpers.ids = [];
    helpers.eventStore.reset(helpers.currentState);
  };

  // Use a path to grab any state
  cerebral.get = function(path) {
    if (!path) {
      throw new Error('You have to pass a path to the get method');
    }
    if (typeof path === 'string') {
      path = [].slice.call(arguments);
    }

    var mapGetter = utils.getMapPath(path, maps);
    if (mapGetter) {
      return mapGetter.value;
    }

    return utils.getPath(path, helpers.currentState);
  };

  // Creates all the mutation methods like set, push, splice, unset etc.
  createMutationMethods(helpers, cerebral);

  // If we are running in the browser we want to move all state, signals and async
  // callbacks to localStorage when the browser is unloading
  if (global.addEventListener) {

    window.addEventListener('beforeunload', function() {

      if (!utils.hasLocalStorage()) {
        return;
      }

      if (helpers.eventStore.willStoreState) {
        localStorage.setItem('cerebral_state', JSON.stringify(helpers.eventStore.initialState));
        localStorage.setItem('cerebral_signals', JSON.stringify(helpers.eventStore.signals));
        localStorage.setItem('cerebral_asyncCallbacks', JSON.stringify(helpers.asyncCallbacks));
      } else {
        localStorage.removeItem('cerebral_state');
        localStorage.removeItem('cerebral_signals');
        localStorage.removeItem('cerebral_asyncCallbacks');
      }

      localStorage.setItem('cerebral_keepState', helpers.eventStore.willKeepState.toString());
      localStorage.setItem('cerebral_storeState', helpers.eventStore.willStoreState.toString());

    });

  }

  // Run all map updates extracted from the initial state to set the actual
  // initial state
  helpers.mapUpdates.forEach(function(update) {
    update();
  });

  // Add recorder signals
  cerebral.signal('recorder.play', function play () { helpers.recorder.play(); });
  cerebral.signal('recorder.stop', function stop () { helpers.recorder.stop(); });
  cerebral.signal('recorder.record', function record () { helpers.recorder.record(); });
  cerebral.signal('recorder.pause', function pause () { helpers.recorder.pause(); });

  return cerebral;

}


module.exports = Cerebral;
