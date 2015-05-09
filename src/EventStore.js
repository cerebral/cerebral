"use strict";

var utils = require('./utils.js');

var EventStore = function(state, store) {
  this.initialState = state;
  this.signals = [];
  this.asyncSignals = [];
  this.mutations = [];
  this.hasExecutingSignals = false;
  this.hasExecutingAsyncSignals = false;
  this.currentIndex = 0;
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
  if (this.currentIndex < this.signals.length) {

    var removedSignals = this.signals.splice(this.currentIndex + 1, this.signals.length - this.currentIndex);
    var lastSignal = removedSignals[0];
    if (lastSignal) {
      this.mutations = this.mutations.filter(function(mutation) {
        return mutation.timestamp < lastSignal.timestamp || mutation.timestamp >= signal.timestamp;
      });
    } else if (this.currentIndex === 0) {
      this.mutations = [];
    }

  }
  this.currentIndex = this.signals.push(signal);
};

EventStore.prototype.addMutation = function(mutation) {
  if (this.hasExecutingSignals) {
    return;
  }
  this.mutations.push(mutation);
};

EventStore.prototype.travel = function(index, state) {

  var store = this.store;

  // Create new store with initial state
  this.hasExecutingSignals = true;
  store.isRemembering = true;
  index = index - 1;

  // Make sure we do not trigger any events
  Object.keys(this.initialState).forEach(function(key) {
    state = state.set(key, this.initialState[key]);
  }, this);

  // If no event, just update the app
  if (index === -1) {
    this.currentIndex = 0;
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

  return store;
};

module.exports = EventStore;
