var get = require('lodash/get')
var CreateSignalFactory = require('./CreateSignalFactory.js')
var CreateRegisterModules = require('./CreateRegisterModules.js')
var Compute = require('./Compute.js')
var EventEmitter = require('events').EventEmitter

var Recorder = require('./modules/recorder')

var Controller = function (Model, services) {
  if (services) {
    console.warn('Passing services to controller is DEPRECATED. Please add them to controller with controller.addServices({})')
  }

  var controller = new EventEmitter()
  var model = Model(controller)
  var compute = Compute(model)
  var signals = {}
  var modules = {}
  services = services || {}

  var signalFactory = CreateSignalFactory(controller, model, services, compute, modules)
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

  controller.signal = function () {
    console.warn('Cerebral: controller.signal() is DEPRECATED. Please use controller.addSignals() instead')
    signal.apply(null, arguments)
  }
  controller.signalSync = function () {
    console.warn('Cerebral: controller.signalSync() is DEPRECATED. Please use controller.addSignals({mySignal: {chain: [], sync: true}}) instead')
    var defaultOptions = arguments[2] || {}
    defaultOptions.isSync = true
    return signal(arguments[0], arguments[1], defaultOptions)
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
  controller.modules = function () {
    console.warn('Cerebral: controller.modules() is DEPRECATED. Please use controller.addModules() instead')
    controller.addModules.apply(controller, arguments)
  }

  controller.addSignals = function (signals, options) {
    Object.keys(signals).forEach(function (key) {
      if (signals[key].chain) {
        options = Object.keys(signals[key]).reduce(function (options, configKey) {
          if (configKey !== 'chain') {
            options[configKey] = signals[key][configKey]
          }
          if (configKey === 'sync') {
            options.isSync = signals[key][configKey]
          }
          return options
        }, options || {})
        signal(key, signals[key].chain, options)
      } else {
        signal(key, signals[key], options)
      }
    })
  }
  controller.signals = function () {
    console.warn('Cerebral: controller.signals() is DEPRECATED. Please use controller.addSignals() instead')
    controller.addSignals.apply(controller, arguments)
  }
  controller.signalsSync = function (signals, options) {
    console.warn('Cerebral: controller.signalsSync() is DEPRECATED. Please use controller.addSignals({mySignal: {chain: [], sync: true}}) instead')
    Object.keys(signals).forEach(function (key) {
      options = options || {}
      options.isSync = true
      signal(key, signals[key], options)
    })
  }
  controller.addServices = function (newServices) {
    Object.keys(newServices).forEach(function (key) {
      service(key, newServices[key])
    })
    return controller.getServices()
  }
  controller.services = function (newServices) {
    console.warn('Cerebral: controller.services() is DEPRECATED. Please use controller.addServices() instead')
    controller.addServices(newServices)
  }

  // emulate loading recorder
  Recorder()({}, controller)

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
