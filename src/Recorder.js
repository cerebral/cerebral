var utils = require('./utils.js');

function Recorder(cerebral, helpers) {

  this.isRecording = false;
  this.isPlaying = false;
  this.runningSignal = false;
  this.hasRecording = false;
  this.cerebral = cerebral;
  this.helpers = helpers;
  this.currentRecording = {};

  this.timers = [];

};

Recorder.prototype.play = function () {

  this.cerebral.merge(this.currentRecording.initialState);
  this.cerebral.set('recorder', {
    isPlaying: true,
    isRecording: false,
    hasRecording: false
  });
  this.currentRecording.signalIndex = 0;
  this.isPlaying = true;
  this.helpers.nextRef = this.currentRecording.nextRef;
  this.helpers.refs = this.currentRecording.refs;
  this.helpers.ids = this.currentRecording.ids;

  if (this.cerebral.isRemembering) {
    return;
  }

  this.currentRecording.signals.forEach(function(signal, index) {

    setTimeout(function() {
      var signalPath = utils.getSignalPath(this.cerebral.signals, signal.name);
      this.runningSignal = true;
      signalPath.path[signalPath.key].apply(this.cerebral, signal.args);
      this.runningSignal = false;
    }.bind(this), signal.timestamp - this.currentRecording.start);

  }.bind(this));

};

Recorder.prototype.record = function () {

  this.cerebral.set(['recorder', 'isRecording'], true);
  this.isRecording = true;

  // When remembering we need to reset the signal as the playback might have
  // occured several times. We also have to set the correct "nextRef"
  if (this.cerebral.isRemembering) {
    this.currentRecording.signalIndex = 0;
    return;
  }

  this.currentRecording = {
    initialState: this.cerebral.toJS(),
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

  this.cerebral.merge('recorder', {
    isRecording: false,
    isPlaying: false,
    hasRecording: true
  });

  this.isRecording = false;
  this.isPlaying = false;

  if (this.cerebral.isRemembering) {
    return;
  } else if (this.cerebral.hasExecutingAsyncSignals()) {
    throw new Error('Cerebral - You can not stop when async signals are running, make sure to handle that with: cerebral.hasExecutingSignal()');
    return;
  }

  this.currentRecording.end = Date.now();

};

Recorder.prototype.pause = function pause() {

  if (this.cerebral.hasExecutingAsyncSignals()) {
    throw new Error('Cerebral - You can not stop when async signals are running, make sure to handle that with: cerebral.hasExecutingSignal()');
    return;
  }

};

Recorder.prototype.load = function() {

};

Recorder.prototype.addSignal = function(signal) {
  this.currentRecording.signals.push(signal);
};

module.exports = Recorder;
