
"use strict";

var createSignalMethod = function(helpers, store) {

  return function() {

    var callbacks = [].slice.call(arguments, 0);
    var name = callbacks.shift();
    
    store.signals[name] = function() {

      var args = [].slice.call(arguments);
      var timestamp = Date.now();
      var returnedArgs = undefined;

      store.allowMutations = true;

      callbacks.forEach(function(callback) {
        returnedArgs = callback.apply(null, [store].concat(returnedArgs === undefined ? args : returnedArgs));
        if (returnedArgs && returnedArgs.then && typeof returnedArgs.then === 'function') {
          throw new Error('You are returning a promise from a synchronous signal, indicating it is async. Check: ' + name);
        }
      });

      store.allowMutations = false;
      
      helpers.currentState.__.eventStore.addSignal({
        name: name,
        timestamp: timestamp,
        args: args.slice()
      });
      
      store.emit('update');

    };

  };

};

module.exports = createSignalMethod;