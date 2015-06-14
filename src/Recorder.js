var utils = require('./utils.js');

function Recorder(cerebral, helpers) {

  this.runningSignal = false;
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
Recorder.prototype.play = function (seek) {

  console.log('### PLAYING!!!');

  clearTimeout(this.durationTimer);
  this.playbackTimers.forEach(clearTimeout);

  this.cerebral.merge(this.currentRecording.initialState);
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

  this.createTimer();

  var triggerSignal = function (signal) {
    var signalPath = utils.getSignalPath(this.cerebral.signals, signal.name);
    this.runningSignal = true;
    signalPath.path[signalPath.key].apply(this.cerebral, signal.args);
    this.runningSignal = false;
  };

  // Optimize with FOR loop
  console.log('RECORDER - PLAY: seek', seek);
  var catchup = this.currentRecording.signals.filter(function (signal) {
    return signal.timestamp - this.currentRecording.start < seek;
  }, this);
  catchup.forEach(triggerSignal.bind(this));

  console.log('RECORDER - PLAY: catchup.length', catchup.length);

  var signalsCount = this.currentRecording.signals.length;
  var startIndex = catchup.length;
  console.log('RECORDER - PLAY: startIndex', startIndex);
  for (var x = startIndex; x < signalsCount; x++) {

    var signal = this.currentRecording.signals[x];
    var durationTarget = signal.timestamp - this.currentRecording.start - seek;
    this.playbackTimers.push(setTimeout(triggerSignal.bind(this, signal), durationTarget));

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

Recorder.prototype.record = function () {

  this.cerebral.set(['recorder', 'isRecording'], true);

  // When remembering we need to reset the signal as the playback might have
  // occured several times. We also have to set the correct "nextRef"
  if (this.cerebral.isRemembering) {
    this.currentRecording.signalIndex = 0;
    return;
  }


  // If we are recording over the previous stuff, go back to start
  if (this.cerebral.get('recorder', 'hasRecording')) {
    this.cerebral.merge(this.currentRecording.initialState);
  }

  // Create initial state that not includes recorder
  var initialState = this.cerebral.toJS();
  delete initialState.recorder;

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

  console.log('RECORDER - PAUSE: Clearing timers');
  clearTimeout(this.durationTimer);
  this.playbackTimers.forEach(clearTimeout);

};

Recorder.prototype.load = function() {

};

Recorder.prototype.addSignal = function(signal) {
  this.currentRecording.signals.push(signal);
};

module.exports = Recorder;
