var utils = require('./utils.js');

module.exports = function (signalStore, controller) {

  if (!utils.isDeveloping()) {
    return {
      update: function () {},
      start: function () {}
    };
  }

  var isInitialized = false;
  var disableDebugger = false;

  var getDetail = function () {
    return JSON.stringify({
      signals: signalStore.getSignals(),
      willKeepState: signalStore.willKeepState(),
      disableDebugger: disableDebugger,
      currentSignalIndex: signalStore.getCurrentIndex(),
      isExecutingAsync: signalStore.isExecutingAsync(),
      isRemembering: signalStore.isRemembering(),
      computedPaths: []
    });
  };

  var update = utils.debounce(function () {

    if (disableDebugger) {
      return;
    }

    var event = new CustomEvent('cerebral.dev.update', {
      detail: getDetail()
    });
    window.dispatchEvent(event);
  }, 100);

  var initialize = function () {

    if (isInitialized) {
      return;
    }

    disableDebugger = utils.hasLocalStorage() && localStorage.getItem('cerebral_disable_debugger') ?
          JSON.parse(localStorage.getItem('cerebral_disable_debugger')) : false;

    var signals = utils.hasLocalStorage() && localStorage.getItem('cerebral_signals') ?
      JSON.parse(localStorage.getItem('cerebral_signals')) : [];

    var willKeepState = utils.hasLocalStorage() && localStorage.getItem('cerebral_willKeepState') ?
      JSON.parse(localStorage.getItem('cerebral_willKeepState')) :
      true;

    if (willKeepState) {
      signalStore.toggleKeepState();
    }

    isInitialized = true;

    // Might be an async signal running here
    if (signalStore.isExecutingAsync()) {
      controller.once('signalEnd', function () {
        var event = new CustomEvent('cerebral.dev.cerebralPong', {
          detail: getDetail()
        });
        signalStore.setSignals(signals);
        signalStore.remember(signalStore.getSignals().length - 1);
        window.dispatchEvent(event);
      });
    } else {
      var event = new CustomEvent('cerebral.dev.cerebralPong', {
        detail: getDetail()
      });
      signalStore.setSignals(signals);
      signalStore.rememberInitial(signalStore.getSignals().length - 1);
      window.dispatchEvent(event);
    }

  };

  window.addEventListener('cerebral.dev.debuggerPing', function () {
    if (utils.isDeveloping()) {
      initialize();
    }
  });

  window.addEventListener('cerebral.dev.requestUpdate', function () {
    update();
  });

  window.addEventListener('cerebral.dev.toggleKeepState', function () {
    signalStore.toggleKeepState();
    update();
  });

  window.addEventListener('cerebral.dev.toggleDisableDebugger', function () {
    disableDebugger = !disableDebugger;
    if (disableDebugger && signalStore.willKeepState()) {
      signalStore.toggleKeepState();
    }
    var event = new CustomEvent('cerebral.dev.update', {
      detail: getDetail()
    });
    window.dispatchEvent(event);
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

  window.addEventListener('cerebral.dev.logComputedPath', function (event) {
    console.log('CEREBRAL - Computed path:', controller.getComputedValue(event.detail));
  });

  window.addEventListener('cerebral.dev.logPath', function (event) {
    var name = event.detail.name;
    var value = controller.get(event.detail.path);
    // toValue instead?
    console.log('CEREBRAL - ' + name + ':', value.toJS ? value.toJS() : value);
  });

  window.addEventListener('cerebral.dev.logModel', function (event) {
    console.log('CEREBRAL - model:', controller.logModel());
  });

  window.addEventListener('unload', function () {

    signalStore.removeRunningSignals();

    utils.hasLocalStorage() && localStorage.setItem('cerebral_signals', isInitialized && signalStore.willKeepState() ? JSON.stringify(signalStore.getSignals()) : JSON.stringify([]));
    utils.hasLocalStorage() && localStorage.setItem('cerebral_willKeepState', isInitialized && JSON.stringify(signalStore.willKeepState()));
    utils.hasLocalStorage() && localStorage.setItem('cerebral_disable_debugger', isInitialized && JSON.stringify(disableDebugger));
  });

  return {
    update: update,
    start: function () {
      var event = new Event('cerebral.dev.cerebralPing');
      window.dispatchEvent(event);
    }
  };

};
