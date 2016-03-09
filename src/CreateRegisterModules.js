var utils = require('./utils.js')

var Devtools = require('./modules/devtools')

module.exports = function (controller, model, allModules) {
  var initialState = {}

  var registerSignals = function (moduleName, signals) {
    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
      scopedSignals[moduleName + '.' + key] = signals[key]
      return scopedSignals
    }, {})

    return controller.addSignals(scopedSignals, {
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
    controller.addServices(scopedServices)
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
      path: moduleExport.path.slice(),
      alias: function (alias) {
        allModules[alias] = moduleExport
      },
      addSignals: registerSignals.bind(null, moduleName),
      signals: function () {
        console.warn('Cerebral: module.signals() is DEPRECATED. Please use module.addSignals() instead')
        module.addSignals.apply(module, arguments)
      },
      signalsSync: function () {
        console.warn('Cerebral: module.signalsSync() is DEPRECATED. Please use module.addSignals({mySignal: {chain: [], immediate: true}}) instead')
        registerSignalsSync.apply(module, [moduleName].concat([].slice.call(arguments)))
      },
      addServices: registerServices.bind(null, moduleName),
      services: function () {
        console.warn('Cerebral: module.services() is DEPRECATED. Please use module.addServices() instead')
        return module.addServices.apply(module, arguments)
      },
      addState: registerInitialState.bind(null, moduleName),
      state: function () {
        console.warn('Cerebral: module.state() is DEPRECATED. Please use module.addState() instead')
        module.addState.apply(module, arguments)
      },
      getSignals: function () {
        var signals = controller.getSignals()
        var path = moduleName.split('.')
        return path.reduce(function (signals, key) {
          return signals[key]
        }, signals)
      },
      addModules: registerModules.bind(null, moduleName),
      modules: function () {
        console.warn('Cerebral: module.modules() is DEPRECATED. Please use module.addModules() instead')
        module.addModules.apply(module, arguments)
      }
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
