/*
  SignalStore will keep track of all signals triggered. It keeps an array of signals with
  actions and mutations related to that signal. It will also track any async signals processing. The SignalStore
  is able to reset state and travel to a "specific point in time" by playing back the signals up to a certain
  signal.
*/

var utils = require('./utils.js');

module.exports = function (signalMethods, controller) {

  // We grab the signals stored in localStorage, if any
  var signals = utils.hasLocalStorage() && localStorage.getItem('cerebral_signals') ?
    JSON.parse(localStorage.getItem('cerebral_signals')) : [];


  // Indicates if signals should be stored or replaced. Grabs from localStorage if available
  var willKeepState = (
    typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ?
    false :
    utils.hasLocalStorage() && localStorage.getItem('cerebral_willKeepState') ?
    JSON.parse(localStorage.getItem('cerebral_willKeepState')) :
    true
  );

  var executingAsyncActionsCount = 0;
  var isRemembering = false;
  var currentIndex = signals.length - 1;
  var hasRememberedInitial = false;

  return {

    // Flips flag of storing signals or replacing them
    toggleKeepState: function() {
      willKeepState = !willKeepState;
    },

    addAsyncAction: function() {
      executingAsyncActionsCount++;
    },

    removeAsyncAction: function () {
      executingAsyncActionsCount--;
    },

    addSignal: function(signal) {

      currentIndex++;

      // When executing signals in EventStore, do not add them again
      if (isRemembering) {
        return;
      }

      // If we are not keeping the state around reset the signals to just
      // keep the latest one
      /* ALWAYS KEEP STATE
      if (!willKeepState) {
        signals = [];
        currentIndex = 0;
      }
      */

      // If we have travelled back and start adding new signals the signals not triggered should
      // be removed. This effectively "changes history"
      if (currentIndex < signals.length) {
        signals.splice(currentIndex, signals.length - currentIndex);
      }

      //signal.index = signals.length;

      // Add signal and set the current signal to be the recently added signal
      signals.push(signal);

    },

    // This is used when loading up the app and producing the last known state
    rememberNow: function() {

      if (!signals.length) {
        return;
      }

      this.remember(signals.length - 1);
    },

    // Will reset the SignalStore
    reset: function() {

      if (!isRemembering) {

        signals = [];

        currentIndex = -1;

        controller.emit('reset');

      }
    },

    rememberInitial: function (index) {

      // Both router and debugger might try to do initial remembering
      if (hasRememberedInitial) {
        return;
      }

      hasRememberedInitial = true;
      this.remember(index);
    },
    remember: function(index) {

      // Flag that we are remembering
      isRemembering = true;
      controller.emit('reset');

      // If going back to initial state, just return and update
      if (index === -1) {

        currentIndex = index;
        isRemembering = false;

      } else {

        // Start from beginning
        currentIndex = -1;

        // Go through signals
        try {

          for (var x = 0; x <= index; x++) {

            var signal = signals[x];
            if (!signal) {
              break;
            }

            // Trigger signal and then set what has become the current signal
            var signalName = signal.name.split('.');
            var signalMethodPath = signalMethods;
            while (signalName.length) {
              signalMethodPath = signalMethodPath[signalName.shift()];
            }

            signalMethodPath.call(null, signal.input, signal.branches);
            currentIndex = x;

          }

        } catch (e) {
          console.log(e);
          console.warn('CEREBRAL - There was an error remembering state, it has been reset');
          this.reset();

        }

      }

      controller.emit('change');
      isRemembering = false;

    },

    removeRunningSignals: function () {
      for (var x = 0; x < signals.length; x++) {
        if (signals[x].isExecuting) {
          signals.splice(x, 1);
          x--;
        }
      }
    },

    getSignals: function () {
      return signals;
    },

    isExecutingAsync: function () {
      return !!executingAsyncActionsCount;
    },

    isRemembering: function () {
        return isRemembering;
    },

    willKeepState: function () {
      return willKeepState;
    },

    getCurrentIndex: function () {
      return currentIndex;
    }

  };

};
