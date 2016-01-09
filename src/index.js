var CreateSignalFactory = require('./CreateSignalFactory.js');
var CreateSignalStore = require('./CreateSignalStore.js');
var CreateRecorder = require('./CreateRecorder.js');
var CreateRegisterModules = require('./CreateRegisterModules.js');
var Devtools = require('./Devtools.js');
var Compute = require('./Compute.js');
var EventEmitter = require('events').EventEmitter;

var Controller = function (Model, services) {

  if (services) {
    console.warn('Passing services to controller is DEPRECATED. Please add them to controller with controller.services({})');
  }

  var controller = new EventEmitter();
  var model = Model(controller);
  var compute = Compute(model);
  var signals = {};
  var devtools = null;
  var signalStore = CreateSignalStore(signals, controller);
  var modules = {};
  services = services || {};

  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    devtools = Devtools(signalStore, controller);
  }

  var recorder = CreateRecorder(signalStore, signals, controller, model);
  var signalFactory = CreateSignalFactory(signalStore, recorder, devtools, controller, model, services, compute, modules);
  var signal = function () {
    var signalNamePath = arguments[0].split('.');
    var signalName = signalNamePath.pop();
    var signalMethodPath = signals;
    while (signalNamePath.length) {
      var pathName = signalNamePath.shift();
      signalMethodPath = signalMethodPath[pathName] = signalMethodPath[pathName] || {};
    }
    return signalMethodPath[signalName] = signalFactory.apply(null, arguments);
  };
  var service = function (name, service) {
    var serviceNamePath = name.split('.');
    var serviceName = serviceNamePath.pop();
    var serviceMethodPath = services;
    while (serviceNamePath.length) {
      var pathName = serviceNamePath.shift();
      serviceMethodPath = serviceMethodPath[pathName] = serviceMethodPath[pathName] || {};
    }
    return serviceMethodPath[serviceName] = service;
  };

  controller.signal = function () {
    console.warn('This method is deprecated, use controller.signals() instead');
    signal.apply(null, arguments);
  };
  controller.signalSync = function () {
    console.warn('This method is deprecated, use controller.signals() instead');
    var defaultOptions = arguments[2] || {};
    defaultOptions.isSync = true;
    return signal.apply(null, [arguments[0], arguments[1], defaultOptions])
  };

  controller.getSignals = function () {
    return signals;
  };
  controller.getServices = function () {
    return services;
  };
  controller.getStore = function () {
    return signalStore;
  };
  controller.getRecorder = function () {
    return recorder;
  };
  controller.get = function () {
    if (typeof arguments[0] === 'function') {
      return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0]);
    }
    var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
    return model.accessors.get(path);
  };
  controller.getDevtools = function () {
    return devtools;
  };
  controller.logModel = function () {
    return model.logModel();
  };
  controller.getModules = function () {
    return modules;
  };

  controller.modules = CreateRegisterModules(controller, model, modules);
  controller.signals = function (signals, options) {
    Object.keys(signals).forEach(function (key) {
      signal(key, signals[key], options);
    });
  };
  controller.signalsSync = function (signals, options) {
    Object.keys(signals).forEach(function (key) {
      options = options || {};
      options.isSync = true;
      signal.call(null, key, signals[key], options);
    });
  };
  controller.services = function (newServices) {
    Object.keys(newServices).forEach(function (key) {
      service(key, newServices[key]);
    });
    return controller.getServices();
  };

  return controller;
};

Controller.ServerController = function (state) {
  var model = {
    accessors: {
      get: function (path) {
        path = path.slice();
        var key = path.pop();
        var grabbedState = state;
        while (path.length) {
          grabbedState = grabbedState[path.shift()];
        }
        return grabbedState[key];
      }
    }
  };
  var compute = Compute(model);

  return {
    isServer: true,
    get: function (path) {
      if (typeof arguments[0] === 'function') {
        return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0]);
      }
      var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
      return model.accessors.get(path);
    }
  }
};

module.exports = Controller;
