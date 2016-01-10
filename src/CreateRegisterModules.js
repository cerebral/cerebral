var utils = require('./utils.js');

module.exports = function (controller, model, allModules) {

  var initialState = {};

  var registerDevToolsSignals = function(moduleName, signals) {
    if (window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__) {
      for (var signal in signals) {
        window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__.signals[
          moduleName + '.' + signal
        ] = signals[signal];
      }
    }
  };

  var registerSignals = function (moduleName, signals) {
    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
      scopedSignals[moduleName + '.' + key] = signals[key];
      return scopedSignals;
    }, {});

    registerDevToolsSignals(moduleName, signals);

    controller.signals(scopedSignals, {
      modulePath: moduleName.split('.')
    });
  };

  var registerSignalsSync = function (moduleName, signals) {
    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
      scopedSignals[moduleName + '.' + key] = signals[key];
      return scopedSignals;
    }, {});

    registerDevToolsSignals(moduleName, signals);

    return controller.signalsSync(scopedSignals, {
      modulePath: moduleName.split('.')
    });
  };

  var registerServices = function (moduleName, services) {
    var scopedServices = Object.keys(services).reduce(function (scopedServices, key) {
      scopedServices[moduleName + '.' + key] = services[key];
      return scopedServices;
    }, {});
    controller.services(scopedServices);
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
          allModules[alias] = moduleExport;
        },
        signals: registerSignals.bind(null, moduleName),
        signalsSync: registerSignalsSync.bind(null, moduleName),
        services: registerServices.bind(null, moduleName),
        state: registerInitialState.bind(null, moduleName),
        getSignals: function () {
          return signals;
        },
        modules: registerModules.bind(null, moduleName)
      };
      var constructedModule = moduleConstructor(module, controller);

      allModules[moduleName] = Object.keys(constructedModule || {}).reduce(function (module, key) {
        module[key] = constructedModule[key];
        return module;
      }, moduleExport);

    });
    return allModules;
  };
};
