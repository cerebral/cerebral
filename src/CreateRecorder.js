var utils = require('./utils.js');

module.exports = function (signalStore, signalMethods, controller, model) {

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

      controller.emit('seek', seek, !!startPlaying, currentRecording);

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
        signalMethodPath.call(null, signal.input, signal.branches);

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
        controller.emit('change');
      }, currentRecording.end - currentRecording.start - seek ));

      controller.emit('change');
    },

    createTimer: function () {
      var update = function () {
        duration += 500;
        controller.emit('duration', duration);
        if (duration < currentRecording.duration) {
          durationTimer = setTimeout(update, 500);
          controller.emit('change');
        }
      }.bind(this);
      durationTimer = setTimeout(update, 500);
    },

    resetState: function () {
      controller.emit('recorderReset', currentRecording.initialState);
    },

    record: function () {

      if (signalStore.isRemembering()) {
        return;
      }


      // If we are recording over the previous stuff, go back to start
      if (currentRecording) {
        this.resetState();
      }

      currentRecording = {
        initialState: model.accessors.export && model.accessors.export(),
        start: Date.now(),
        signals: []
      };

      isRecording = true;

      controller.emit('change');

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

      controller.emit('change');

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

      controller.emit('change');

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
    },

    loadRecording: function (recording) {
      currentRecording = recording;
    }

  };

};
