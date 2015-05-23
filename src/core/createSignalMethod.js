"use strict";
var utils = require('./../utils.js');
var createAsyncSignalMethod = function(helpers, store) {

  return function() {

    var callbacks = [].slice.call(arguments, 0);
    var name = callbacks.shift();

    store.signals[name] = function() {

      var args = [].slice.call(arguments);
      var executionArray = callbacks.slice();
      var signalIndex = helpers.eventStore.willKeepState ? ++helpers.eventStore.currentIndex : 0;
      var initiatedSignal = helpers.runningSignal || name;

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

            store.allowMutations = true;
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

            isAsync = !!(
              helpers.asyncCallbacks[helpers.runningSignal] &&
              helpers.asyncCallbacks[helpers.runningSignal][signalIndex] &&
              (action.name in helpers.asyncCallbacks[helpers.runningSignal][signalIndex])
            );

            if (store.isRemembering && isAsync) {
              result = helpers.asyncCallbacks[helpers.runningSignal][signalIndex][action.name];
            } else if (Array.isArray(callback)) {
              result = Promise.all(callback.map(function(callback) {
                return callback.apply(null, signalArgs);
              }));
            } else {
              result = callback.apply(null, signalArgs);
            }

            var isPromise = utils.isPromise(result);

            signal.duration += action.duration = Date.now() - actionStart;
            action.isAsync = !!(isPromise || (store.isRemembering && isAsync));

            if (utils.isObject(result) && !utils.isPromise(result)) {
              Object.freeze(result);
            }
            store.allowMutations = false;

            if (isPromise) {

              // Have to run update when next action is async
              if (callbacks.indexOf(callback) !== 0) {
                store.emit('mapUpdate');
                !helpers.eventStore.isSilent && store.emit('update');
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

                helpers.asyncCallbacks[initiatedSignal] = helpers.asyncCallbacks[initiatedSignal] || {};
                helpers.asyncCallbacks[initiatedSignal][signalIndex] = helpers.asyncCallbacks[initiatedSignal][signalIndex] || {};
                helpers.asyncCallbacks[initiatedSignal][signalIndex][action.name] = result || null; // JS or Chrome bug causing undefined not to set key

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
              store.emit('mapUpdate');
              execute(result);
            }

          } else {
            !helpers.eventStore.isSilent && store.emit('update');
            helpers.runningSignal = null;
          }

        }.bind(null, store);

        helpers.eventStore.addSignal(signal);
        execute.apply(null, args);

      };

      if (!!helpers.runningSignal || store.isRemembering || typeof requestAnimationFrame === 'undefined') {
        runSignal();
      } else {
        requestAnimationFrame(runSignal);
      }

    };

  };

};

module.exports = createAsyncSignalMethod;
