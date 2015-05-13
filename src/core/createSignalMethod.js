"use strict";
var utils = require('./../utils.js');
var createAsyncSignalMethod = function(helpers, store) {

  return function() {

    var callbacks = [].slice.call(arguments, 0);
    var name = callbacks.shift();

    store.signals[name] = function() {
      var args = [].slice.call(arguments);
      var executionArray = callbacks.slice();
      var signalId = ++helpers.nextSignal;
      var runMutation = function() {

        var timestamp = Date.now();
        var execute = function() {

          if (executionArray.length) {

            var signalArgs = [].slice.call(arguments);
            var callback = executionArray.shift();

            // Run mutation
            store.allowMutations = true;
            helpers.currentSignal = signalId;
            var result = store.isRemembering && callback.isAsync ? callback.results[name][signalId] : callback.apply(null, signalArgs);
            if (utils.isObject(result) && !utils.isPromise(result)) {
              Object.freeze(result);
            }
            store.allowMutations = false;

            if (utils.isPromise(result)) {

              helpers.currentState.__.eventStore.addAsyncSignal({
                signalId: signalId,
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
                originCallback.results[name][signalId] = result;

                helpers.currentState.__.eventStore.addAsyncSignal({
                  signalId: signalId,
                  name: name,
                  start: timestamp,
                  end: Date.now()
                });

                // Have to update again after an async action
                var result = execute(result);
                store.emit('update');
                return result;
              }).catch(function(err) {
                helpers.currentState.__.eventStore.addAsyncSignal({
                  signalId: signalId,
                  name: name,
                  start: timestamp,
                  failed: err,
                  end: Date.now()
                });
              });

            } else {
              execute(result);
            }

          }

        }.bind(null, store);

        execute.apply(null, args);

        helpers.currentState.__.eventStore.addSignal({
          id: signalId,
          name: name,
          timestamp: timestamp,
          duration: Date.now() - timestamp,
          args: args.slice()
        });

        store.emit('update');

      };

      if (store.isRemembering) {
        runMutation();
      } else {
        requestAnimationFrame(runMutation);
      }

    };

  };

};

module.exports = createAsyncSignalMethod;
