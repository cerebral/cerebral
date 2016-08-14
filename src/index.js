var getByPath = require('./getByPath')
var CreateSignalFactory = require('./CreateSignalFactory.js')
var CreateRegisterModules = require('./CreateRegisterModules.js')
var EventEmitter = require('events').EventEmitter
var Computed = require('./Computed')

var Controller = function (Model) {
  var controller = new EventEmitter()
  var model = Model(controller)
  var signals = {}
  var modules = {}
  var services = {}
  var externalContextProviders = {__cerebral_global__: []}

  var signalFactory = CreateSignalFactory(controller, externalContextProviders)
  var signal = function () {
    var signalNamePath = arguments[0].split('.')
    var signalName = signalNamePath.pop()
    var signalMethodPath = signals
    while (signalNamePath.length) {
      var pathName = signalNamePath.shift()
      signalMethodPath = signalMethodPath[pathName] = signalMethodPath[pathName] || {}
    }
    var signal = signalMethodPath[signalName] = signalFactory.apply(null, arguments)
    return signal
  }
  var service = function (name, service) {
    var serviceNamePath = name.split('.')
    var serviceName = serviceNamePath.pop()
    var serviceMethodPath = services
    while (serviceNamePath.length) {
      var pathName = serviceNamePath.shift()
      serviceMethodPath = serviceMethodPath[pathName] = serviceMethodPath[pathName] || {}
    }
    serviceMethodPath[serviceName] = service
    return service
  }

  controller.getSignals = function (path) {
    return path
      ? getByPath(signals, path)
      : signals
  }
  controller.getServices = function (path) {
    return path
      ? getByPath(services, path)
      : services
  }
  controller.getModel = function () {
    return model
  }
  controller.get = function (path) {
    return model.accessors.get(typeof path === 'string' ? path.split('.') : path)
  }
  controller.logModel = function () {
    return model.logModel()
  }
  controller.getModules = function (moduleName) {
    return moduleName
      ? modules[moduleName]
      : modules
  }

  controller.addModules = CreateRegisterModules(controller, model, modules)

  controller.addSignals = function (signals, options) {
    Object.keys(signals).forEach(function (name) {
      if (signals[name].chain) {
        var optionsCopy = Object.keys(options || {}).reduce(function (optionsCopy, key) {
          optionsCopy[key] = options[key]
          return optionsCopy
        }, {})
        var signalOptions = Object.keys(signals[name]).reduce(function (signalOptions, key) {
          if (key !== 'chain') {
            signalOptions[key] = signals[name][key]
          }
          return signalOptions
        }, optionsCopy)
        signal(name, signals[name].chain, signalOptions)
      } else {
        signal(name, signals[name], options)
      }
    })
  }
  controller.addServices = function (newServices) {
    Object.keys(newServices).forEach(function (key) {
      service(key, newServices[key])
    })
    return controller.getServices()
  }
  controller.addContextProvider = function (provider, scope) {
    if (scope) {
      if (!externalContextProviders[scope]) {
        externalContextProviders[scope] = []
      }
      externalContextProviders[scope].push(provider)
    } else {
      externalContextProviders.__cerebral_global__.push(provider)
    }
    externalContextProviders[scope || '__cerebral_global__'].push(provider)
  }

  controller.on('flush', Computed.updateCache)

  return controller
}

module.exports.getByPath = getByPath
module.exports.Controller = Controller
module.exports.Computed = Computed
module.exports.ServerController = function (state) {
  var model = {
    accessors: {
      get: function (path) {
        path = typeof path === 'string' ? path.split('.') : path
        return path.reduce(function (currentState, key) {
          return currentState[key]
        }, state)
      }
    }
  }

  return {
    isServer: true,
    get: function (path) {
      return model.accessors.get(path)
    }
  }
}
