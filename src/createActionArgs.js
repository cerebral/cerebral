var utils = require('./utils.js');

var createStateArg = function (action, model, isAsync) {
  var state = {};
  state.get = function () {
    var path = arguments.length ? Array.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments) : [];
    return model.get(path);
  };
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
  }, state)
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
