"use strict";
var utils = require('./../utils.js');
var createAsyncSignalMethod = function(helpers, store) {

  return function() {

    var callbacks = [].slice.call(arguments, 0);
    var name = callbacks.shift();

    store.signals[name] = function() {
      var args = [].slice.call(arguments);
      var executionArray = callbacks.slice();
      var signalIndex = helpers.nextSignal++;
      var runMutation = function() {

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

            var signalArgs = [].slice.call(arguments);
            var callback = executionArray.shift();

            store.allowMutations = true;
            helpers.currentSignal = signalIndex;

            // Run action
            var action = {
              signalIndex: signalIndex,
              index: callbacks.indexOf(callback),
              name: utils.getFunctionName(callback),
              duration: 0,
              mutations: []
            };
            helpers.eventStore.addAction(action);
            var actionStart = Date.now();
            var result = store.isRemembering && callback.isAsync ? callback.results[name][signalIndex] : callback.apply(null, signalArgs);
            var isPromise = utils.isPromise(result);
            
            signal.duration += action.duration = Date.now() - actionStart;
            action.isAsync = !!(isPromise || (store.isRemembering && callback.isAsync));

            if (utils.isObject(result) && !utils.isPromise(result)) {
              Object.freeze(result);
            }
            store.allowMutations = false;

            if (isPromise) {
              
              // Have to run update when next action is async
              if (callbacks.indexOf(callback) !== 0) {
                store.emit('update');
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

                var originCallback = callbacks[callbacks.indexOf(callback)];
                originCallback.isAsync = true;
                originCallback.results = originCallback.results || {};
                originCallback.results[name] = originCallback.results[name] || {};
                originCallback.results[name][signalIndex] = result;

                helpers.eventStore.addAsyncSignal({
                  signalIndex: signalIndex,
                  name: name,
                  start: timestamp,
                  end: Date.now()
                });

                // Have to update again after an async action
                var result = execute(result);

                return result;
              }).catch(function(err) {
                helpers.eventStore.addAsyncSignal({
                  signalIndex: signalIndex,
                  name: name,
                  start: timestamp,
                  failed: err,
                  end: Date.now()
                });
              });

            } else {
              execute(result);
            }

          } else {
            store.emit('update');
          }

        }.bind(null, store);

        helpers.eventStore.addSignal(signal);
        execute.apply(null, args);

      };

      if (store.isRemembering || typeof requestAnimationFrame === 'undefined') {
        runMutation();
      } else {
        requestAnimationFrame(runMutation);
      }

    };

  };

};

module.exports = createAsyncSignalMethod;
