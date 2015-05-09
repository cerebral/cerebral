"use strict";

var utils = require('./../utils.js');

var mutators = ['set', 'merge', 'push', 'unshift', 'splice', 'shift', 'concat', 'pop'];
var createMutationMethods = function(helpers, store) {

  mutators.reduce(function(store, mutator) {

    store[mutator] = function() {

      var args = [].slice.call(arguments);
      var originArgs = args.slice();

      if (!store.allowMutations) {
        throw new Error('You are mutating the store outside a signal. Mutation: "' + mutator + '"" with arguments ' + JSON.stringify(args));
      }

      // A merge can be on object passed
      var path = args.length === 1 && utils.isObject(args[0]) ? [] : args.shift().slice();
      path = typeof path === 'string' ? [path] : path;

      // If it is a set move the key to the first argument
      if (mutator === 'set') {
        args.unshift(path.pop());
      }

      path = utils.getPath(path, helpers.currentState);

      try {
        helpers.currentState = path[mutator].apply(path, args);
      } catch (e) {
        throw new Error('Unable to run a "' + mutator + '" on: ' + JSON.stringify(path));
      }

      helpers.currentState.__.eventStore.addMutation({
        name: mutator,
        timestamp: Date.now(),
        path: path.__.path.slice(),
        args: args.slice()
      });

    };
    return store;

  }, store);

};

module.exports = createMutationMethods;
