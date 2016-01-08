var utils = require('./utils.js');

module.exports = function (controller, model) {

  var initialState = {};

  var registerSignal = function (moduleName, name, chain) {
    return controller.signal(moduleName + '.' + name, chain, {
      modulePath: moduleName.split('.')
    });
  };

  var registerSignalSync = function (moduleName, name, chain) {
    return controller.signalSync(moduleName + '.' + name, chain, {
      modulePath: moduleName.split('.')
    });
  };

  var registerService = function (moduleName, name, service) {
    utils.setDeep(controller.services, moduleName + '.' + name, service);
  };

  var registerInitialState = function (moduleName, state) {
    utils.setDeep(initialState, moduleName, state);
    model.mutators.set(moduleName.split('.'), state);
  };

  controller.on('reset', function () {
    model.mutators.merge([], initialState);
  });

  return function registerModules (parentModuleName, modules) {
    if (arguments.length === 1) {
      modules = parentModuleName;
      parentModuleName = null;
    }
    Object.keys(modules).forEach(function (moduleName) {
      var moduleConstructor = modules[moduleName];
      var actualName = moduleName;
      if (parentModuleName) {
        moduleName = parentModuleName + '.' + moduleName;
      }
      var signals = utils.setDeep(controller.signals, moduleName, {});
      var moduleExport = {
        name: actualName,
        path: moduleName.split('.')
      };
      var module = {
        name: moduleName,
        alias: function (alias) {
          controller.modules[alias] = moduleExport;
        },
        signal: registerSignal.bind(null, moduleName),
        signalSync: registerSignalSync.bind(null, moduleName),
        service: registerService.bind(null, moduleName),
        state: registerInitialState.bind(null, moduleName),
        signals: signals,
        registerModules: registerModules.bind(null, moduleName)
      };
      var constructedModule = moduleConstructor(module, controller);

      controller.modules[moduleName] = Object.keys(constructedModule || {}).reduce(function (module, key) {
        module[key] = constructedModule[key];
        return module;
      }, moduleExport);

    });
    return controller.modules;
  };
};
