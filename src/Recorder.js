var utils = require('./utils.js');

function Recorder(cerebral, helpers) {

  this.cerebral = cerebral;
  this.helpers = helpers;

  // TODO: Move signalIndex to the recorder itself?
  this.currentRecording = {};
  this.lastSignal = null;
  this.durationTimer = null;
  this.playbackTimers = [];
  this.pauseState = null;

  this.timers = [];

};

// ACTION
Recorder.prototype.seek = function (seek, startPlaying) {

  clearTimeout(this.durationTimer);
  this.playbackTimers.forEach(clearTimeout);

  this.cerebral.merge(this.path, this.currentRecording.initialState);
  this.cerebral.merge('recorder', {
    isPlaying: true,
    isRecording: false,
    isPaused: false,
    hasRecording: true,
    isAtEnd: false,
    duration: this.currentRecording.duration,
    currentDuration: seek,
    started: Date.now(),
    seek: seek
  });

  this.currentRecording.signalIndex = 0;
  this.helpers.nextRef = this.currentRecording.nextRef;
  this.helpers.refs = this.currentRecording.refs;
  this.helpers.ids = this.currentRecording.ids;

  if (this.cerebral.isRemembering) {
    return;
  }

  // Runs the signal synchronously
  var triggerSignal = function (signal) {

    var signalPath = utils.getSignalPath(this.cerebral.signals, signal.name);
    this.helpers.runningSignal = signal.name;
    signalPath.path[signalPath.key].apply(this.cerebral, signal.args);
    
    // Running catchup signals changes this to false
    this.cerebral.allowMutations = true;
  };

  // Optimize with FOR loop
  var catchup = this.currentRecording.signals.filter(function (signal) {
    return signal.timestamp - this.currentRecording.start < seek;
  }, this);
  catchup.forEach(triggerSignal.bind(this));

  if (startPlaying) {
    this.createTimer();
    var signalsCount = this.currentRecording.signals.length;
    var startIndex = catchup.length;
    for (var x = startIndex; x < signalsCount; x++) {

      var signal = this.currentRecording.signals[x];
      var durationTarget = signal.timestamp - this.currentRecording.start - seek;
      this.playbackTimers.push(setTimeout(triggerSignal.bind(this, signal), durationTarget));

    }
  } else {
      this.cerebral.set(['recorder', 'isPlaying'], false);
  }

};

Recorder.prototype.createTimer = function () {
  var duration = this.cerebral.get('recorder', 'currentDuration');
  var update = function () {
    duration += 500;
    this.cerebral.signals.recorder.durationUpdated(duration);
    if (duration < this.currentRecording.duration) {
      this.durationTimer = setTimeout(update, 500);
    } 
  }.bind(this);
  this.durationTimer = setTimeout(update, 500);
};

Recorder.prototype.resetState = function () {
  this.cerebral.merge(this.path, this.currentRecording.initialState);
};

Recorder.prototype.record = function (path) {

  this.path = path ? path.split('.') : [];

  this.cerebral.set(['recorder', 'isRecording'], true);

  // When remembering we need to reset the signal as the playback might have
  // occured several times. We also have to set the correct "nextRef"
  if (this.cerebral.isRemembering) {
    this.currentRecording.signalIndex = 0;
    return;
  }


  // If we are recording over the previous stuff, go back to start
  if (this.cerebral.get('recorder', 'hasRecording')) {
    this.resetState();
  }

  // Create initial state that not includes recorder
  var initialState = this.cerebral.get(path).toJS();
  if (!path.length) {
    delete initialState.recorder;
  }

  this.currentRecording = {
    initialState: initialState,
    signalIndex: 0,
    start: Date.now(),
    signals: [],
    nextRef: this.helpers.nextRef,
    refs: this.helpers.refs.slice(),
    ids: this.helpers.ids.slice(),
    asyncCallbacks: {}
  };

};

Recorder.prototype.stop = function () {

  var wasPlaying = this.cerebral.get('recorder', 'isPlaying');

  this.cerebral.merge('recorder', {
    isRecording: false,
    isPlaying: false,
    hasRecording: true,
    isAtEnd: true,
    currentDuration: this.currentRecording.duration
  });

  clearTimeout(this.durationTimer);

  if (this.cerebral.isRemembering || wasPlaying) {
    return;
  } else if (this.cerebral.hasExecutingAsyncSignals()) {
    throw new Error('Cerebral - You can not stop when async signals are running, make sure to handle that with: cerebral.hasExecutingSignal()');
    return;
  }

  this.currentRecording.end = Date.now();

  var duration = this.currentRecording.end - this.currentRecording.start;
  this.currentRecording.duration = duration;

};

Recorder.prototype.pause = function pause() {

  if (this.cerebral.hasExecutingAsyncSignals()) {
    throw new Error('Cerebral - You can not stop when async signals are running, make sure to handle that with: cerebral.hasExecutingSignal()');
    return;
  }

  this.cerebral.merge('recorder', {
    isRecording: false,
    isPlaying: false,
    isPaused: true,
    seek: this.cerebral.get('recorder', 'seek') +  Date.now() - this.cerebral.get('recorder', 'started')
  });

  if (this.cerebral.isRemembering) {
    return;
  }

  clearTimeout(this.durationTimer);
  this.playbackTimers.forEach(clearTimeout);

};

Recorder.prototype.load = function() {

};

Recorder.prototype.addSignal = function(signal) {
  this.currentRecording.signals.push(signal);
};

module.exports = Recorder;
