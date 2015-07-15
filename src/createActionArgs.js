var createStateMutator = function (actions, options) {

  return function (hooks, key) {
    hooks[key.toLowerCase()] = function () {
      if (key === 'Get') {
        var path = typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
        return options.onGet && options.onGet(path);
      } else {

        // args can be (path, value), ([path], value), (value)
        var path = arguments.length === 1 ? [] : typeof arguments[0] === 'string' ? [arguments[0]] : arguments[0];
        var args = arguments.length === 1 ? [].slice.call(arguments) : [].slice.call(arguments).splice(1);
        actions[actions.length - 1].mutations.push({
          name: key.toLowerCase(),
          path: path.slice(),
          args: args
        });
        return options['on' + key] && options['on' + key].apply(null, [path].concat(args));
      }
    };
    return hooks;
  };

};

module.exports = {
  sync: function (actions, signalArgs, options) {

    return [
      signalArgs,
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
      signalArgs,
      [
        'Get'
      ].reduce(createStateMutator(actions, options), {})
    ];

  }
};
