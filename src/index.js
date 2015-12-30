var CreateSignalFactory = require('./CreateSignalFactory.js');
var CreateSignalStore = require('./CreateSignalStore.js');
var CreateRecorder = require('./CreateRecorder.js');
var Devtools = require('./Devtools.js');
var Compute = require('./Compute.js');
var EventEmitter = require('events').EventEmitter;

var Controller = function (Model, services) {

  var controller = new EventEmitter();
  var model = Model(controller);
  var compute = Compute(model);
  var signals = {};
  var devtools = null;
  var signalStore = CreateSignalStore(signals, controller);

  services = services || {};

  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    devtools = Devtools(signalStore, controller);
  }

  var recorder = CreateRecorder(signalStore, signals, controller, model);
  var signalFactory = CreateSignalFactory(signalStore, recorder, devtools, controller, model, services, compute);
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

  controller.signal = signal;
  controller.signalSync = function () {
    var defaultOptions = arguments[2] || {};
    defaultOptions.isSync = true;
    return signal.apply(null, [arguments[0], arguments[1], defaultOptions])
  }
  controller.services = services;
  controller.signals = signals;
  controller.store = signalStore;
  controller.recorder = recorder;
  controller.get = function () {
    if (typeof arguments[0] === 'function') {
      return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0]);
    }
    var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
    return model.accessors.get(path);
  };
  controller.devtools = devtools;
  services.recorder = recorder;

  controller.modules = {};
  controller.extends = function (modules) {
    Object.keys(modules).forEach(function (moduleName) {
      var module = modules[moduleName];
      Object.keys(module.signals || {}).forEach(function (key) {
        if (Array.isArray(module.signals[key])) {
          var signalName = moduleName + '.' + key;
          controller.signal(signalName, module.signals[key]);
        }
      });
      controller.modules[moduleName] = {
        signals: signals[moduleName],
        services: module.services
      };
      if (typeof module.init === 'function') {
        var meta = module.init({
          controller,
          name: moduleName,
          signals: signals[moduleName]
        });
        if (typeof meta === 'object') {
          Object.keys(meta).forEach(function (key) {
            controller.modules[moduleName][key] = meta[key];
          });
        }
      }
      controller.services[moduleName] = controller.modules[moduleName].services;
    });
    return controller.modules;
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
