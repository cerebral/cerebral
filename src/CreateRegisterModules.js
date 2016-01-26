var utils = require('./utils.js')

var Devtools = require('./modules/devtools')

module.exports = function (controller, model, allModules) {
  var initialState = {}

  var registerSignals = function (moduleName, signals) {
    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
      scopedSignals[moduleName + '.' + key] = signals[key]
      return scopedSignals
    }, {})

    return controller.signals(scopedSignals, {
      modulePath: moduleName.split('.')
    })
  }

  var registerSignalsSync = function (moduleName, signals) {
    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
      scopedSignals[moduleName + '.' + key] = signals[key]
      return scopedSignals
    }, {})
    return controller.signalsSync(scopedSignals, {
      modulePath: moduleName.split('.')
    })
  }

  var registerServices = function (moduleName, services) {
    var scopedServices = Object.keys(services).reduce(function (scopedServices, key) {
      scopedServices[moduleName + '.' + key] = services[key]
      return scopedServices
    }, {})
    controller.services(scopedServices)
  }

  var registerInitialState = function (moduleName, state) {
    utils.setDeep(initialState, moduleName, state)
    model.mutators.set(moduleName.split('.'), state)
  }

  var registerModules = function (parentModuleName, modules) {
    if (arguments.length === 1) {
      modules = parentModuleName
      parentModuleName = null

      // TODO: remove after devtools extracted to external module
      if (utils.isDeveloping() && !modules.devtools && !controller.getModules().devtools) {
        modules.devtools = Devtools()
      }
    }

    Object.keys(modules).forEach(function (moduleName) {
      registerModule(moduleName, parentModuleName, modules)
    })

    if (arguments.length === 1) {
      controller.emit('modulesLoaded', { modules: allModules })
    }

    return allModules
  }

  var registerModule = function (moduleName, parentModuleName, modules) {
    var moduleConstructor = modules[moduleName]
    var actualName = moduleName
    if (parentModuleName) {
      moduleName = parentModuleName + '.' + moduleName
    }
    var moduleExport = {
      name: actualName,
      path: moduleName.split('.')
    }
    var module = {
      name: moduleName,
      alias: function (alias) {
        allModules[alias] = moduleExport
      },
      signals: registerSignals.bind(null, moduleName),
      signalsSync: registerSignalsSync.bind(null, moduleName),
      services: registerServices.bind(null, moduleName),
      state: registerInitialState.bind(null, moduleName),
      getSignals: function () {
        var signals = controller.getSignals()
        var path = moduleName.split('.')
        return path.reduce(function (signals, key) {
          return signals[key]
        }, signals)
      },
      modules: registerModules.bind(null, moduleName)
    }
    var constructedModule = moduleConstructor(module, controller)

    moduleExport.meta = constructedModule
    module.meta = constructedModule
    allModules[moduleName] = moduleExport

    return moduleExport
  }

  controller.on('reset', function () {
    model.mutators.merge([], initialState)
  })

  return registerModules
}
