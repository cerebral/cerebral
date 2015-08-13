var utils = require('./utils.js');

var onlyPathMutations = [
  'unset',
  'shift',
  'pop'
];

var createStateMutator = function (actions, options, isAsync) {

  return function (hooks, key) {

    var name = key.toLowerCase();

    hooks[key.toLowerCase()] = function () {

      var path = null;
      var args = null;

      if (name === 'get') {
        path = typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
        return options.onGet && options.onGet(path);
      }

      if (isAsync) {
        throw new Error('Cerebral: You can not mutate state in async actions. Output values and set them with a sync action');
      }

      if (onlyPathMutations.indexOf(name) >= 0) {

        path = typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
        args = [];

      } else if (name === 'merge') {

        path = arguments.length === 1 ? [] : arguments[0];
        args = arguments.length === 1 ? [arguments[0]] : [arguments[1]];

      } else {

        path = typeof arguments[0] === 'string' ? [arguments[0]] : arguments[0];
        args = [].slice.call(arguments).splice(1);

      }

      actions[actions.length - 1].mutations.push({
        name: name,
        path: path.slice(),
        args: args
      });

      return options['on' + key] && options['on' + key].apply(null, [path].concat(args));

    };

    return hooks;
  };

};

module.exports = {
  sync: function (actions, signalArgs, options) {
    return [
      utils.merge(utils.merge({}, signalArgs), options.defaultArgs || {}),
      [
        'Get',
        'Set',
        'Unset',
        'Push',
        'Concat',
        'Shift',
        'Unshift',
        'Merge',
        'Splice',
        'Pop'
      ].reduce(createStateMutator(actions, options), {})
    ];

  },
  async: function (actions, signalArgs, options) {

    return [
      utils.merge(utils.merge({}, signalArgs), options.defaultArgs || {}),
      [
        'Get',
        'Set',
        'Unset',
        'Push',
        'Concat',
        'Shift',
        'Unshift',
        'Merge',
        'Splice',
        'Pop'
      ].reduce(createStateMutator(actions, options, true), {})
    ];

  }
};
