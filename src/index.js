var CreateSignalFactory = require('./CreateSignalFactory.js');
var CreateSignalStore = require('./CreateSignalStore.js');
var CreateRecorder = require('./CreateRecorder.js');
var Devtools = require('./Devtools.js');

module.exports = {
  Controller: function (options) {

    options = options || {};

    var signals = {};
    var signalStore = CreateSignalStore(signals, options);
    if (typeof window !== 'undefined') {
      var devtools = Devtools(signalStore, options);
    }
    var recorder = CreateRecorder(signalStore, signals, options);
    var signalFactory = CreateSignalFactory(signalStore, recorder, devtools, options);

    return {
      signal: function () {
        signals[arguments[0]] = signalFactory.apply(null, arguments);
      },
      signals: signals,
      store: signalStore,
      recorder: recorder,
      get: function () {
        var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
        return options.onGet(path);
      }
    };

  },
  Value: function (path, obj) {
    path = path.slice();
    while (path.length) {
      obj = obj[path.shift()];
    }
    return obj;
  }
}
