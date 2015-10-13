var utils = require('./utils.js');

var createStateArg = function (action, model, isAsync, compute) {
  var state = Object.keys(model.accessors || {}).reduce(function (state, accessor) {
    state[accessor] = function () {
      var args = [].slice.call(arguments);
      var path = args[0] ? Array.isArray(args[0]) ? args.shift() : [args.shift()] : [];
      return model.accessors[accessor].apply(null, [path].concat(args));
    };
    return state;
  }, {});
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

  state.getComputed = compute.getComputedValue;

  return state;
};

module.exports = {
  sync: function (action, signalArgs, model, compute) {
    return [
      signalArgs,
      createStateArg(action, model, false, compute)
    ];

  },
  async: function (action, signalArgs, model, compute) {
    return [
      signalArgs,
      createStateArg(action, model, true, compute)
    ];

  }
};
