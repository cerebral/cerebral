var get = require('lodash/get')
var CreateSignalFactory = require('./CreateSignalFactory.js')
var CreateRegisterModules = require('./CreateRegisterModules.js')
var Compute = require('./Compute.js')
var EventEmitter = require('events').EventEmitter

var Controller = function (Model) {
  var controller = new EventEmitter()
  var model = Model(controller)
  var compute = Compute(model)
  var signals = {}
  var modules = {}
  var services = {}
  var externalContextProviders = []

  var signalFactory = CreateSignalFactory(controller, model, services, compute, modules, externalContextProviders)
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
      ? get(signals, path)
      : signals
  }
  controller.getServices = function (path) {
    return path
      ? get(services, path)
      : services
  }
  controller.get = function () {
    if (typeof arguments[0] === 'function') {
      return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0])
    }
    var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0]
    return model.accessors.get(path)
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
  controller.addContextProvider = function (provider) {
    externalContextProviders.push(provider)
  }

  return controller
}

Controller.ServerController = function (state) {
  var model = {
    accessors: {
      get: function (path) {
        path = path.slice()
        var key = path.pop()
        var grabbedState = state
        while (path.length) {
          grabbedState = grabbedState[path.shift()]
        }
        return grabbedState[key]
      }
    }
  }
  var compute = Compute(model)

  return {
    isServer: true,
    get: function (path) {
      if (typeof arguments[0] === 'function') {
        return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0])
      }
      path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0]
      return model.accessors.get(path)
    }
  }
}

module.exports = Controller
