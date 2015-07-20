var utils = require('./utils.js');

module.exports = function (signalStore, options) {


  var getDetail = function () {
    return {
      state: options.onGet([]),
      props: {
        signals: signalStore.getSignals(),
        willKeepState: signalStore.willKeepState(),
        currentSignalIndex: signalStore.getCurrentIndex(),
        isExecutingAsync: signalStore.isExecutingAsync(),
        isRemembering: signalStore.isRemembering()
      }
    };
  };

  var update = function (name) {
    var event = new CustomEvent(name || 'cerebral.dev.update', {
      detail: getDetail()
    });
    window.dispatchEvent(event);
  };

  window.addEventListener('cerebral.dev.initialize', function () {
    signalStore.remember(signalStore.getSignals().length - 1);
    update('cerebral.dev.initialized');
  });
  update('cerebral.dev.initialized');

  window.addEventListener('cerebral.dev.toggleKeepState', function () {
    signalStore.toggleKeepState();
    update();
  });

  window.addEventListener('cerebral.dev.toggleStoreState', function () {
    signalStore.toggleStoreState();
    update();
  });

  window.addEventListener('cerebral.dev.resetStore', function () {
    signalStore.reset();
    update();
  });

  window.addEventListener('cerebral.dev.remember', function (event) {
    signalStore.remember(event.detail);
    update();
  });

  window.addEventListener('cerebral.dev.logPath', function (event) {
    var name = event.detail.name;
    var value = options.onGet(event.detail.path);
    // toValue instead?
    console.log('CEREBRAL - ' + name + ':', value.toJS ? value.toJS() : value);
  });

  window.addEventListener('unload', function () {
    utils.hasLocalStorage() && localStorage.setItem('cerebral_signals', JSON.stringify(signalStore.getSignals()));
    utils.hasLocalStorage() && localStorage.setItem('cerebral_willKeepState', JSON.stringify(signalStore.willKeepState()));
  });

  return {
    update: update
  };

};
