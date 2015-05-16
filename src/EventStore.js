"use strict";

var utils = require('./utils.js');

var EventStore = function(state, store) {

  var signals = utils.hasLocalStorage() && localStorage.getItem('cerebral_signals') ?
    JSON.parse(localStorage.getItem('cerebral_signals')) : [];

  this.initialState = state;
  this.willKeepState = utils.hasLocalStorage() && localStorage.getItem('cerebral_keepState') ?
    JSON.parse(localStorage.getItem('cerebral_keepState')) : true;
  this.signals = signals;
  this.asyncSignals = [];
  this.hasExecutingSignals = false;
  this.hasExecutingAsyncSignals = false;
  this.currentIndex = -1;
  this.store = store;
  this.isSilent = false;

};

EventStore.prototype.toggleKeepState = function() {
  this.willKeepState = !this.willKeepState;
  this.store.emit('eventStoreUpdate');
};

EventStore.prototype.addAsyncSignal = function(signal) {

  if (signal.end) {
    var startSignal = this.asyncSignals.filter(function(existingSignal) {
      return existingSignal.start === existingSignal.start;
    }).pop();
    this.asyncSignals.splice(this.asyncSignals.indexOf(startSignal), 1);
  } else {
    this.asyncSignals.push(signal);
    if (this.asyncSignals.length === 1) {
      this.hasExecutingAsyncSignals = true;
      this.store.emit('eventStoreUpdate');
    }
  }
  if (!this.asyncSignals.length) {
    this.hasExecutingAsyncSignals = false;
    this.store.emit('eventStoreUpdate');
  }

};

EventStore.prototype.addSignal = function(signal) {
  if (this.hasExecutingSignals) {
    return;
  }
  if (!this.willKeepState) {
    this.signals = [];
  }
  if (this.currentIndex < this.signals.length - 1) {

    this.signals.splice(this.currentIndex + 1, this.signals.length - this.currentIndex);

  }
  this.signals.push(signal);
  this.currentIndex = this.signals.length - 1;
};

EventStore.prototype.addAction = function(action) {
  if (this.hasExecutingSignals) {
    return;
  }
  this.signals[action.signalIndex].actions.push(action);
};

EventStore.prototype.addMutation = function(mutation) {
  if (this.hasExecutingSignals) {
    return;
  }
  var signal = this.signals[mutation.signalIndex];
  signal.actions[signal.actions.length - 1].mutations.push(mutation);
};

EventStore.prototype.rememberNow = function(state) {

  if (!this.signals.length) {
    return;
  }

  this.isSilent = true;
  if (this.hasExecutingAsyncSignals) {
    var lastAsyncSignal = this.asyncSignals.sort(function(a, b) {
        return a.signalIndex - b.signalIndex;
      })
      .pop();
    this.signals.splice(lastAsyncSignal.signalIndex, this.signals.length - lastAsyncSignal.signalIndex);
  }
  this.travel(this.signals.length - 1, state);
  this.isSilent = false;
};

EventStore.prototype.reset = function(state) {
  if (!this.hasExecutingAsyncSignals) {

    this.signals = [];

    // First remove all state, as there might have been some
    // additions
    Object.keys(state).forEach(function (key) {
      state = state.unset(key);
    });

    // Make sure we do not trigger any events
    Object.keys(this.initialState).forEach(function(key) {
      state = state.set(key, this.initialState[key]);
    }, this);

    this.currentIndex = -1;

    this.store.emit('update');

  }
};

EventStore.prototype.travel = function(index, state) {

  var store = this.store;

  // Create new store with initial state
  this.hasExecutingSignals = true;
  store.isRemembering = true;

  // Make sure we do not trigger any events
  Object.keys(this.initialState).forEach(function(key) {
    state = state.set(key, this.initialState[key]);
  }, this);

  // If no event, just update the app
  if (index === -1) {

    this.currentIndex = index;
    this.hasExecutingSignals = false;
    store.isRemembering = false;
    store.emit('update');
    return store;

  } else {
    // Run through events
    for (var x = 0; x <= index; x++) {

      var signal = this.signals[x];
      if (!signal) {
        break;
      }
      store.signals[signal.name].apply(store, signal.args);
      this.currentIndex = x;

    }
  }

  this.hasExecutingSignals = false;
  store.isRemembering = false;
  store.emit('eventStoreUpdate');

  return store;
};

module.exports = EventStore;
