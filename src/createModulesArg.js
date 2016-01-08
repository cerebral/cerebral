var utils = require('./utils.js');

module.exports = function (modules, state, services) {
  var modulesArg = {};
  Object.keys(modules).forEach(function (key) {
    var path = modules[key].path;
    var module = {};
    module.state = Object.keys(state).reduce(function (module, key) {
      module[key] = function () {
        var args = [].slice.call(arguments);
        var statePath = path;
        if (args[0] && Array.isArray(args[0])) {
          statePath = statePath.concat(args.shift());
        } else if (args[0] && typeof args[0] === 'string') {
          statePath = statePath.concat(args.shift().split('.'));
        }
        return state[key].apply(null, [statePath].concat(args));
      }
      return module;
    }, {});
    module.services = path.reduce(function (services, key) {
      return services ? services[key] : null;
    }, services);

    utils.setDeep(modulesArg, key, module);
  });
  return modulesArg;
}
