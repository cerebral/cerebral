module.exports = function (controller, model) {

  var initialState = {};

  var registerSignal = function (moduleName, name, chain) {
    return controller.signal(moduleName + '.' + name, chain, {
      module: moduleName
    });
  };

  var registerSignalSync = function (moduleName, name, chain) {
    return controller.signalSync(moduleName + '.' + name, chain, {
      module: moduleName
    });
  };

  var registerService = function (moduleName, name, service) {
    controller.services[moduleName] = controller.services[moduleName] || {};
    controller.services[moduleName][name] = service;
  };

  var registerInitialState = function (moduleName, state) {
    initialState[moduleName] = state;
    model.mutators.set([moduleName], state);
  };

  controller.on('reset', function () {
    model.mutators.merge([], initialState);
  });

  return function (modules) {
    Object.keys(modules).forEach(function (moduleName) {
      var moduleConstructor = modules[moduleName];
      controller.signals[moduleName] = {};
      var module = {
        name: moduleName,
        alias: function (alias) {
          controller.modules[alias] = module;
        },
        signal: registerSignal.bind(null, moduleName),
        signalSync: registerSignalSync.bind(null, moduleName),
        service: registerService.bind(null, moduleName),
        state: registerInitialState.bind(null, moduleName),
        signals: controller.signals[moduleName]
      };
      var constructedModule = moduleConstructor(module, controller);

      return controller.modules[moduleName] = Object.keys(constructedModule || {}).reduce(function (module, key) {
        module[key] = constructedModule[key];
        return module;
      }, {
        name: moduleName
      });
    });
    return controller.modules;
  };
};
