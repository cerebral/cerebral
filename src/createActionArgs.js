var utils = require('./utils.js');

var createStateArg = function (action, model, isAsync) {
  var state = {};
  Object.keys(model.accessors || {}).reduce(function (state, accessor) {
    state[accessor] = function () {
      var path = [];
      var args = [].slice.call(arguments);
      if (Array.isArray(args[0])) {
        path = args.shift();
      } else if (typeof args[0] === 'string') {
        path = [args.shift()];
      }
      return model.accessors[accessor].apply(null, [path.slice()].concat(args));
    };
    return state;
  }, state);
  Object.keys(model.mutators || {}).reduce(function (state, mutator) {
    state[mutator] = function () {
      if (isAsync) {
        throw new Error('Cerebral: You can not mutate state in async actions. Output values and set them with a sync action');
      }
      var path = [];
      var args = [].slice.call(arguments);
      if (Array.isArray(args[0])) {
        path = args.shift();
      } else if (typeof args[0] === 'string') {
        path = [args.shift()];
      }
      action.mutations.push({
        name: mutator,
        path: path.slice(),
        args: args
      });
      return model.mutators[mutator].apply(null, [path.slice()].concat(args));
    };
    return state;
  }, state);
  return state;
};

module.exports = {
  sync: function (action, signalArgs, model) {
    return [
      signalArgs,
      createStateArg(action, model, false)
    ];

  },
  async: function (action, signalArgs, model) {
    return [
      signalArgs,
      createStateArg(action, model, true)
    ];

  }
};
