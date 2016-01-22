var CreateSignalFactory = require('./CreateSignalFactory.js')
var CreateRegisterModules = require('./CreateRegisterModules.js')
var Compute = require('./Compute.js')
var EventEmitter = require('events').EventEmitter

var Recorder = require('./modules/recorder')

var Controller = function (Model, services) {
  if (services) {
    console.warn('Passing services to controller is DEPRECATED. Please add them to controller with controller.services({})')
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
    console.warn('Cerebral: controller.signal() is deprecated, use controller.signals() instead')
    signal.apply(null, arguments)
  }
  controller.signalSync = function () {
    console.warn('Cerebral: controller.signalSync() is deprecated, use controller.signals() instead')
    var defaultOptions = arguments[2] || {}
    defaultOptions.isSync = true
    return signal(arguments[0], arguments[1], defaultOptions)
  }

  controller.getSignals = function () {
    return signals
  }
  controller.getServices = function () {
    return services
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
  controller.getModules = function () {
    return modules
  }

  controller.modules = CreateRegisterModules(controller, model, modules)
  controller.signals = function (signals, options) {
    Object.keys(signals).forEach(function (key) {
      signal(key, signals[key], options)
    })
  }
  controller.signalsSync = function (signals, options) {
    Object.keys(signals).forEach(function (key) {
      options = options || {}
      options.isSync = true
      signal(key, signals[key], options)
    })
  }
  controller.services = function (newServices) {
    Object.keys(newServices).forEach(function (key) {
      service(key, newServices[key])
    })
    return controller.getServices()
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
