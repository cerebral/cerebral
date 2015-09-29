var utils = require('./utils.js');

module.exports = function (signalStore, controller) {

  var getDetail = function () {
    return {
      props: {
        signals: JSON.parse(JSON.stringify(signalStore.getSignals())),
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
  }, 100);

  var initialize = function () {

    // Might be an async signal running here
    if (signalStore.isExecutingAsync()) {
      controller.once('signalEnd', function () {
        var event = new CustomEvent('cerebral.dev.initialized', {
          detail: getDetail()
        });
        signalStore.remember(signalStore.getSignals().length - 1);
        window.dispatchEvent(event);
      });
    } else {
      var event = new CustomEvent('cerebral.dev.initialized', {
        detail: getDetail()
      });
      signalStore.rememberInitial(signalStore.getSignals().length - 1);
      window.dispatchEvent(event);
    }

  };

  window.addEventListener('cerebral.dev.toggleKeepState', function () {
    signalStore.toggleKeepState();
    update();
  });

  window.addEventListener('cerebral.dev.resetStore', function () {
    signalStore.reset();
    controller.emit('change');
    update();
  });

  window.addEventListener('cerebral.dev.remember', function (event) {
    signalStore.remember(event.detail);
    update();
  });

  window.addEventListener('cerebral.dev.logPath', function (event) {
    var name = event.detail.name;
    var value = controller.get(event.detail.path);
    // toValue instead?
    console.log('CEREBRAL - ' + name + ':', value.toJS ? value.toJS() : value);
  });

  window.addEventListener('cerebral.dev.logModel', function (event) {
    console.log('CEREBRAL - model:', controller.get());
  });

  window.addEventListener('unload', function () {
    signalStore.removeRunningSignals();
    utils.hasLocalStorage() && localStorage.setItem('cerebral_signals', signalStore.willKeepState() ? JSON.stringify(signalStore.getSignals()) : JSON.stringify([]));
    utils.hasLocalStorage() && localStorage.setItem('cerebral_willKeepState', JSON.stringify(signalStore.willKeepState()));
  });

  return {
    update: update,
    start: function () {
      if (utils.isDeveloping()) {
        if (window.CEREBRAL_DEBUGGER_INJECTED) {
          initialize();
        } else {
          window.addEventListener('cerebral.dev.initialize', function () {
            initialize();
          });
        }
      }
    }
  };

};
