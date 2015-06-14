"use strict";
var utils = require('./../utils.js');
var createSignalMethod = function(helpers, cerebral) {

  return function() {

    var callbacks = [].slice.call(arguments, 0);
    var name = callbacks.shift();
    var signalPath = utils.getSignalPath(cerebral.signals, name);

    signalPath.path[signalPath.key] = function() {

      var args = [].slice.call(arguments);
      var executionArray = callbacks.slice();
      var signalIndex = helpers.eventStore.willKeepState ? ++helpers.eventStore.currentIndex : 0;
      var recorderSignalIndex = 0;
      var recorderState = cerebral.get('recorder');

      // The recorder has its own internal signal index handling
      if (recorderState.isPlaying || recorderState.isRecording) {
        recorderSignalIndex = helpers.recorder.currentRecording.signalIndex++;
      }

      var runSignal = function() {

        var timestamp = Date.now();
        var signal = {
          index: signalIndex,
          name: name,
          actions: [],
          duration: 0,
          timestamp: timestamp,
          args: args.slice()
        };

        var execute = function() {

          if (executionArray.length) {

            helpers.runningSignal = helpers.runningSignal || name;
            helpers.subSignal = helpers.runningSignal === name ? null : name;

            var signalArgs = [].slice.call(arguments);
            var callback = executionArray.shift();
            var result = null;
            var isAsync = false;

            cerebral.allowMutations = true;
            helpers.currentSignal = signalIndex;

            // Run action
            var action = {
              signalIndex: signalIndex,
              signalName: name,
              index: callbacks.indexOf(callback),
              name: utils.getFunctionName(callback),
              duration: 0,
              mutations: []
            };
            helpers.eventStore.addAction(action);
            var actionStart = Date.now();

            // We verify an async action by either checking general asyncCallbacks in cerebral
            // or the ones specifically to the recording
            isAsync = !!(
              (
                helpers.asyncCallbacks[helpers.runningSignal] &&
                helpers.asyncCallbacks[helpers.runningSignal][signalIndex] &&
                (action.name in helpers.asyncCallbacks[helpers.runningSignal][signalIndex])
                ) ||
              (
                recorderState.isPlaying &&
                helpers.recorder.currentRecording.asyncCallbacks[helpers.runningSignal] &&
                helpers.recorder.currentRecording.asyncCallbacks[helpers.runningSignal][recorderSignalIndex] &&
                (action.name in helpers.recorder.currentRecording.asyncCallbacks[helpers.runningSignal][recorderSignalIndex])     
              )
            );

            // If we are remembering something async and the async is not from a recording playback
            if (cerebral.isRemembering && isAsync && !recorderState.isPlaying) {
              result = helpers.asyncCallbacks[helpers.runningSignal][signalIndex][action.name];

            // If async and playing back recording, use recording async results
            } else if (isAsync && recorderState.isPlaying) {
              result = helpers.recorder.currentRecording.asyncCallbacks[helpers.runningSignal][recorderSignalIndex][action.name];
            } else if (Array.isArray(callback)) {
              result = Promise.all(callback.map(function(callback) {
                return callback.apply(null, signalArgs);
              }));
            } else {
              result = callback.apply(null, signalArgs);
            }

            var isPromise = utils.isPromise(result);

            signal.duration += action.duration = Date.now() - actionStart;
            action.isAsync = !!(isPromise || (cerebral.isRemembering && isAsync) || (recorderState.isPlaying && isAsync));

            if (utils.isObject(result) && !utils.isPromise(result)) {
              Object.freeze(result);
            }
            cerebral.allowMutations = false;

            if (isPromise) {

              // Have to run update when next action is async
              if (callbacks.indexOf(callback) !== 0) {
                cerebral.emit('mapUpdate');
                !cerebral.isRemembering && cerebral.emit('update');
              }

              helpers.eventStore.addAsyncSignal({
                signalIndex: signalIndex,
                name: name,
                start: timestamp,
                args: args.slice()
              });

              result.then(function(result) {

                if (utils.isObject(result) && !utils.isPromise(result)) {
                  Object.freeze(result);
                }

                helpers.asyncCallbacks[name] = helpers.asyncCallbacks[name] || {};
                helpers.asyncCallbacks[name][signalIndex] = helpers.asyncCallbacks[name][signalIndex] || {};
                helpers.asyncCallbacks[name][signalIndex][action.name] = result || null; // JS or Chrome bug causing undefined not to set key

                if (recorderState.isRecording) {
                  var currentRecording = helpers.recorder.currentRecording;
                  currentRecording.asyncCallbacks[name] = currentRecording.asyncCallbacks[name] || {};
                  currentRecording.asyncCallbacks[name][recorderSignalIndex] = currentRecording.asyncCallbacks[name][recorderSignalIndex] || {};
                  currentRecording.asyncCallbacks[name][recorderSignalIndex][action.name] = result || null; // JS or Chrome bug causing undefined not to set key
                }

                helpers.eventStore.addAsyncSignal({
                  signalIndex: signalIndex,
                  name: name,
                  start: timestamp,
                  end: Date.now()
                });

                return execute(result);

              }).catch(function(err) {
                if (
                  err instanceof EvalError ||
                  err instanceof RangeError ||
                  err instanceof ReferenceError ||
                  err instanceof SyntaxError ||
                  err instanceof TypeError
                ) {
                  throw err;
                }

                helpers.eventStore.addAsyncSignal({
                  signalIndex: signalIndex,
                  name: name,
                  start: timestamp,
                  failed: err,
                  end: Date.now()
                });
              });

            } else {
              cerebral.emit('mapUpdate');
              execute(result);
            }

          } else {
            !cerebral.isRemembering && cerebral.emit('update');
            helpers.runningSignal = null;
          }

        }.bind(null, cerebral);

        // Adds signal if recording. Any mutations and actions
        // are added to this reference, so do not need to handle that
        if (recorderState.isRecording) {
          helpers.recorder.addSignal(signal);
        }
        helpers.eventStore.addSignal(signal);
        execute.apply(null, args);

      };

      if (!!helpers.runningSignal || cerebral.isRemembering || typeof requestAnimationFrame === 'undefined') {
        runSignal();
      } else {
        requestAnimationFrame(runSignal);
      }

    };

  };

};

module.exports = createSignalMethod;
