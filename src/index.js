var CreateSignalFactory = require('./CreateSignalFactory.js');
var CreateSignalStore = require('./CreateSignalStore.js');
var CreateRecorder = require('./CreateRecorder.js');
var Devtools = require('./Devtools.js');
var Compute = require('./Compute.js');
var EventEmitter = require('events').EventEmitter;

module.exports = function (Model, services) {

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
  var signalFactory = CreateSignalFactory(signalStore, recorder, devtools, controller, model, services);

  controller.signal = function () {
    var signalNamePath = arguments[0].split('.');
    var signalName = signalNamePath.pop();
    var signalMethodPath = signals;
    while (signalNamePath.length) {
      var pathName = signalNamePath.shift();
      signalMethodPath = signalMethodPath[pathName] = signalMethodPath[pathName] || {};
    }
    signalMethodPath[signalName] = signalFactory.apply(null, arguments);
  };

  controller.services = services;
  controller.signals = signals;
  controller.store = signalStore;
  controller.recorder = recorder;
  controller.get = function () {
    var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
    return model.accessors.get(path);
  };
  controller.devtools = devtools;
  controller.compute = compute.register;
  controller.getComputedValue = compute.getComputedValue;
  controller.getComputedPaths = compute.getComputedPaths;
  services.recorder = recorder;

  return controller;
};
