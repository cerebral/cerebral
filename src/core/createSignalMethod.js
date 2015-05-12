"use strict";

var createAsyncSignalMethod = function(helpers, store) {

  return function() {

    var callbacks = [].slice.call(arguments, 0);
    var name = callbacks.shift();

    store.signals[name] = function() {
      var args = [].slice.call(arguments);
      var timestamp = Date.now();
      var executionArray = callbacks.slice();
      var signalId = ++helpers.nextSignal;
      var execute = function() {

        if (executionArray.length) {

          var signalArgs = [].slice.call(arguments);
          var callback = executionArray.shift();

          store.allowMutations = true;
          var result = store.isRemembering && callback.isAsync ? callback.results[name] : callback.apply(null, signalArgs);
          store.allowMutations = false;

          if (result && result.then && typeof result.then === 'function') {

            helpers.currentState.__.eventStore.addAsyncSignal({
              signalId: signalId,
              name: name,
              start: timestamp,
              args: args.slice()
            });

            result.then(function(result) {

              var originCallback = callbacks[callbacks.indexOf(callback)];
              originCallback.isAsync = true;
              originCallback.results = originCallback.results || {};
              originCallback.results[name] = result;
              
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
              console.error(err);
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
        args: args.slice()
      });

      store.emit('update');

    };

  };

};

module.exports = createAsyncSignalMethod;
