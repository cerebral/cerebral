"use strict";

/*
  EventStore will keep track of all signals triggered on the cerebral. It keeps an array of signals with
  actions and mutations related to that signal. It will also track any async signals processing. The EventStore
  is able to reset state and travel to a "specific point in time" by playing back the signals up to a certain
  signal.
*/

var utils = require('./utils.js');

var EventStore = function(state, cerebral) {

  // We grab the signals stored in localStorage, if any
  var signals = utils.hasLocalStorage() && localStorage.getItem('cerebral_signals') ?
    JSON.parse(localStorage.getItem('cerebral_signals')) : [];

  // The initial state is used to reset the cerebral
  this.initialState = state;

  // Indicates if signals should be stored or replaced. Grabs from localStorage if available
  this.willKeepState = utils.hasLocalStorage() && localStorage.getItem('cerebral_keepState') ?
    JSON.parse(localStorage.getItem('cerebral_keepState')) : true;

  this.signals = signals;
  this.asyncSignals = [];

  // Flag used to evaluate that new signals should be stored, as they will trigger when "travelling"
  this.hasExecutingSignals = false;

  // Flag used by debugger to evaluate if travelling should be possible. Should not travel while executing
  // signals
  this.hasExecutingAsyncSignals = false;

  // -1 means "no"
  this.currentIndex = -1;

  // We keep a reference to the cerebral
  this.cerebral = cerebral;

  // When travelling it should not trigger any events
  // TODO: Might make more sense to put this on the cerebral
  this.isSilent = false;

};

// Flips flag of storing signals or replacing them. Needs to trigger a special
// event to notify Debugger about the change
EventStore.prototype.toggleKeepState = function() {
  this.willKeepState = !this.willKeepState;
  this.cerebral.emit('eventStoreUpdate');
};

EventStore.prototype.addAsyncSignal = function(signal) {

  // If it is an ending async signal, remove it from the list by comparing
  // the start time. TODO: Should also check name of signal?
  if (signal.end) {

    var startSignal = this.asyncSignals.filter(function(existingSignal) {
      return existingSignal.start === existingSignal.start;
    }).pop();
    this.asyncSignals.splice(this.asyncSignals.indexOf(startSignal), 1);

  // Or add it to the list
  } else {

    this.asyncSignals.push(signal);

    // If it is the first signal we should flip flag and notify with an event
    if (this.asyncSignals.length === 1) {
      this.hasExecutingAsyncSignals = true;
      this.cerebral.emit('eventStoreUpdate');
    }

  }

  // When no more signals flip flag and notify with event
  if (!this.asyncSignals.length) {
    this.hasExecutingAsyncSignals = false;
    this.cerebral.emit('eventStoreUpdate');
  }

};

// Adds signals triggered on the cerebral
EventStore.prototype.addSignal = function(signal) {

  // When executing signals in EventStore, do not add them again
  if (this.hasExecutingSignals) {
    return;
  }
  
  // If we are not keeping the state around reset the signals to just
  // keep the latest one
  if (!this.willKeepState) {
    this.signals = [];
  }
  
  // If we have travelled back and start adding new signals the signals not triggered should
  // be removed. This effectively "changes history"
  if (this.currentIndex < this.signals.length - 1) {
    this.signals.splice(this.currentIndex + 1, this.signals.length - this.currentIndex);
  }

  // Add signal and set the current signal to be the recently added signal
  this.signals.push(signal);
  this.currentIndex = this.signals.length - 1;

};

// Adds an action to the signal, unless travelling
EventStore.prototype.addAction = function(action) {
  if (this.hasExecutingSignals) {
    return;
  }
  this.signals[action.signalIndex].actions.push(action);
};

// Adds a mutation to an action inside a signal, unless travelling
EventStore.prototype.addMutation = function(mutation) {
  if (this.hasExecutingSignals) {
    return;
  }
  var signal = this.signals[mutation.signalIndex];
  signal.actions[signal.actions.length - 1].mutations.push(mutation);
};

// TODO: What names to use, remember or just signals?
// This is used when loading up the app and producing the last known state
EventStore.prototype.rememberNow = function(state) {

  if (!this.signals.length) {
    return;
  }

  // Silently travels (does not trigger events) before the
  // app is loaded
  this.isSilent = true;

  /*
  TODO: Is this needed? As it only runs when starting app. Maybe when using react-hot-loader?
  if (this.hasExecutingAsyncSignals) {
    var lastAsyncSignal = this.asyncSignals.sort(function(a, b) {
        return a.signalIndex - b.signalIndex;
      })
      .pop();
    this.signals.splice(lastAsyncSignal.signalIndex, this.signals.length - lastAsyncSignal.signalIndex);
  }
  */
  this.travel(this.signals.length - 1, state);
  this.isSilent = false;
};

// Will reset the EventStore and cerebral completely
// TODO: Should be in the cerebral really? Mostly cerebral related code here
EventStore.prototype.reset = function(state) {
  if (!this.hasExecutingAsyncSignals) {

    this.signals = [];

    // Remove all mapUpdate listeners as map functions will be added again
    // TODO: Make sure added map functions are removed from helpers
    this.cerebral.removeAllListeners('mapUpdate');

    // First remove all state, as some code might have added
    // new props
    Object.keys(state).forEach(function (key) {
      state = state.unset(key);
    });

    // Now set the initial state
    // TODO: Should this do the same object diffing?
    Object.keys(this.initialState).forEach(function(key) {
      state = state.set(key, this.initialState[key]);
    }, this);

    this.currentIndex = -1;

    // Update app with new data
    this.cerebral.emit('update');

  }
};

EventStore.prototype.travel = function(index, state) {

  var cerebral = this.cerebral;

  // Flag that we are travelling.
  // TODO: Should it be named remember instead?
  // TODO: Is not hasExecutingSignals and isRemembering the same?
  // TODO: Remove mapUpdate here too? Maybe have some resetToInitialState method?
  this.hasExecutingSignals = true;
  cerebral.isRemembering = true;
  cerebral.removeAllListeners('mapUpdate');

  // TODO: This should also be part of general reset?
  Object.keys(this.initialState).forEach(function(key) {
    state = state.set(key, this.initialState[key]);
  }, this);

  // If going back to initial state, just return and update
  if (index === -1) {

    this.currentIndex = index;
    this.hasExecutingSignals = false;
    cerebral.isRemembering = false;
    cerebral.emit('update');
    return cerebral;

  } else {

    // Start from beginning
    this.currentIndex = -1;

    // Go through signals
    for (var x = 0; x <= index; x++) {

      var signal = this.signals[x];
      if (!signal) {
        break;
      }

      // Trigger signal and then set what has become the current signal
      cerebral.signals[signal.name].apply(cerebral, signal.args);
      this.currentIndex = x;

    }
  }

  // Reset flags and emit event to Debugger
  this.hasExecutingSignals = false;
  cerebral.isRemembering = false;
  cerebral.emit('eventStoreUpdate');

  return cerebral;
};

module.exports = EventStore;
