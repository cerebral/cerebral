var utils = require('./utils.js');

module.exports = function (signalStore, signalMethods, options) {

  var currentRecording = null;
  var lastSignal = null;
  var durationTimer = null;
  var playbackTimers = [];
  var pauseState = null;
  var timers = [];
  var duration = 0;
  var started = null;
  var ended = null;
  var isPlaying = false;
  var isRecording = false;
  var isCatchingUp = false;
  var currentSeek = 0;

  return {

    seek: function (seek, startPlaying) {

      clearTimeout(durationTimer);
      playbackTimers.forEach(clearTimeout);

      options.onSeek && options.onSeek(seek, !!startPlaying, currentRecording);

      if (signalStore.isRemembering()) {
        return;
      }

      // Runs the signal synchronously
      var triggerSignal = function (signal) {
        var signalName = signal.name.split('.');
        var signalMethodPath = signalMethods;
        while (signalName.length) {
          signalMethodPath = signalMethodPath[signalName.shift()];
        }
        signalMethodPath.call(null, signal.payload, signal.asyncActionResults.slice());

      };

      // Optimize with FOR loop
      var catchup = currentRecording.signals.filter(function (signal) {
        return signal.start - currentRecording.start < seek;
      });
      isCatchingUp = true;
      catchup.forEach(triggerSignal);
      isCatchingUp = false;

      if (startPlaying) {
        this.createTimer();
        var signalsCount = currentRecording.signals.length;
        var startIndex = catchup.length;
        for (var x = startIndex; x < signalsCount; x++) {

          var signal = currentRecording.signals[x];
          var durationTarget = signal.start - currentRecording.start - seek;
          playbackTimers.push(setTimeout(triggerSignal.bind(null, signal), durationTarget));

        }
        isPlaying = true;
        started = Date.now();
      }
      playbackTimers.push(setTimeout(function () {
        isPlaying = false;
        options.onUpdate && options.onUpdate();
      }, currentRecording.end - currentRecording.start - seek ));
      options.onUpdate && options.onUpdate();
    },

    createTimer: function () {
      var update = function () {
        duration += 500;
        options.onDurationChange && options.onDurationChange(duration);
        if (duration < currentRecording.duration) {
          durationTimer = setTimeout(update, 500);
          options.onUpdate && options.onUpdate();
        }
      }.bind(this);
      durationTimer = setTimeout(update, 500);
    },

    resetState: function () {
      options.onRecorderReset && options.onRecorderReset(currentRecording.initialState);
    },

    record: function (initialState, meta) {

      if (signalStore.isRemembering()) {
        return;
      }


      // If we are recording over the previous stuff, go back to start
      if (currentRecording) {
        this.resetState();
      }

      currentRecording = {
        initialState: initialState,
        start: Date.now(),
        signals: [],
        meta: meta
      };

      isRecording = true;

      options.onUpdate && options.onUpdate();

    },

    stop: function () {

      var wasPlaying = isPlaying;
      clearTimeout(durationTimer);
      isPlaying = false;
      isRecording = false;

      if (signalStore.isRemembering() || wasPlaying) {
        return;
      } else if (signalStore.isExecutingAsync()) {
        throw new Error('Cerebral - You can not stop when async signals are running, make sure to handle that with: cerebral.hasExecutingSignal()');
        return;
      }

      currentRecording.end = Date.now();
      currentRecording.duration = currentRecording.end - currentRecording.start;

      options.onUpdate && options.onUpdate();

    },

    pause: function pause() {

      if (signalStore.isExecutingAsync()) {
        throw new Error('Cerebral - You can not stop when async signals are running, make sure to handle that with: cerebral.hasExecutingSignal()');
        return;
      }

      if (signalStore.isRemembering()) {
        return;
      }

      ended = Date.now();
      currentSeek = ended - started;
      clearTimeout(durationTimer);
      playbackTimers.forEach(clearTimeout);

      options.onUpdate && options.onUpdate();

    },

    addSignal: function(signal) {
      currentRecording.signals.push(signal);
    },

    isRecording: function () {
      return isRecording;
    },

    isPlaying: function () {
      return isPlaying;
    },

    isCatchingUp: function () {
      return isCatchingUp;
    },

    getRecording: function () {
      return currentRecording;
    },

    getCurrentSeek: function () {
      return currentSeek;
    }

  };

};
