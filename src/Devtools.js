var utils = require('./utils.js');

module.exports = function (signalStore, options) {

  // If not running in browser
  if (typeof window === 'undefined') {
    return;
  }

  var getDetail = function () {
    return {
      props: {
        signals: signalStore.getSignals(),
        willKeepState: signalStore.willKeepState(),
        currentSignalIndex: signalStore.getCurrentIndex(),
        isExecutingAsync: signalStore.isExecutingAsync(),
        isRemembering: signalStore.isRemembering()
      }
    };
  };

  var update = utils.debounce(function () {
    var event = new CustomEvent('cerebral.dev.update', {
      detail: getDetail()
    });
    window.dispatchEvent(event);
  }, 50);

  var initialize = function () {
    var event = new CustomEvent('cerebral.dev.initialized', {
      detail: getDetail()
    });
    window.dispatchEvent(event);
  };

  window.addEventListener('cerebral.dev.initialize', function () {
    signalStore.remember(signalStore.getSignals().length - 1);
    initialize();
  });
  initialize();

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
    options.onUpdate && options.onUpdate();
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
