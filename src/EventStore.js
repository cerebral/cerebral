"use strict";

var utils = require('./utils.js');

var EventStore = function(state, store) {
  this.initialState = state;
  this.signals = [];
  this.asyncSignals = [];
  this.hasExecutingSignals = false;
  this.hasExecutingAsyncSignals = false;
  this.currentIndex = -1;
  this.store = store;
};

EventStore.prototype.addAsyncSignal = function (signal) {

  if (signal.end) {
    var startSignal = this.asyncSignals.filter(function (existingSignal) {
      return existingSignal.start === existingSignal.start;
    }).pop();
    this.asyncSignals.splice(this.asyncSignals.indexOf(startSignal), 1);
  } else {
    this.asyncSignals.push(signal);
    if (this.asyncSignals.length === 1) {
      this.hasExecutingAsyncSignals = true;
      this.store.emit('update');
    }
  }
  if (!this.asyncSignals.length) {
    this.hasExecutingAsyncSignals = false;
    this.store.emit('update');
  }

};

EventStore.prototype.addSignal = function(signal) {
  if (this.hasExecutingSignals) {
    return;
  }
  if (this.currentIndex < this.signals.length - 1) {

    this.signals.splice(this.currentIndex + 1, this.signals.length - this.currentIndex);

  }
  this.signals.push(signal);
  this.currentIndex = this.signals.length - 1;
};

EventStore.prototype.addAction = function (action) {
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
  store.emit('update');

  return store;
};

module.exports = EventStore;
