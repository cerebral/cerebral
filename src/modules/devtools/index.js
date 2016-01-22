/* eslint-env browser*/
var MODULE = 'cerebral-module-devtools'
var SignalStore = require('../signalStore')
var utils = require('./../../utils.js')

module.exports = function Devtools () {
  if (typeof window === 'undefined') {
    return function () {}
  }

  return function init (module, controller) {
    module.alias(MODULE)

    module.modules({
      store: SignalStore()
    })

    var signalStore = controller.getServices()[module.name].store

    var isInitialized = false
    var disableDebugger = false
    var willKeepState = false

    var getDetail = function () {
      return JSON.stringify({
        signals: signalStore.getSignals(),
        willKeepState: willKeepState,
        disableDebugger: disableDebugger,
        currentSignalIndex: signalStore.getCurrentIndex(),
        isExecutingAsync: signalStore.isExecutingAsync(),
        isRemembering: signalStore.isRemembering(),
        computedPaths: []
      })
    }

    var update = utils.debounce(function () {
      if (disableDebugger) {
        return
      }

      var event = new CustomEvent('cerebral.dev.update', {
        detail: getDetail()
      })
      window.dispatchEvent(event)
    }, 100)

    var initialize = function () {
      if (isInitialized) return
      var signals = []

      if (utils.hasLocalStorage()) {
        disableDebugger = JSON.parse(localStorage.getItem('cerebral_disable_debugger'))
        signals = JSON.parse(localStorage.getItem('cerebral_signals'))
        willKeepState = JSON.parse(localStorage.getItem('cerebral_willKeepState'))
      }

      isInitialized = true

      // Might be an async signal running here
      if (willKeepState && signalStore.isExecutingAsync()) {
        controller.once('signalEnd', function () {
          var event = new CustomEvent('cerebral.dev.cerebralPong', {
            detail: getDetail()
          })
          signalStore.setSignals(signals)
          signalStore.remember(signalStore.getSignals().length - 1)
          window.dispatchEvent(event)
        })
      } else {
        signalStore.setSignals(signals)
        signalStore.rememberInitial(signalStore.getSignals().length - 1)
        var event = new CustomEvent('cerebral.dev.cerebralPong', {
          detail: getDetail()
        })
        window.dispatchEvent(event)
      }
    }

    window.addEventListener('cerebral.dev.debuggerPing', function () {
      if (utils.isDeveloping()) {
        initialize()
      }
    })

    window.addEventListener('cerebral.dev.requestUpdate', function () {
      update()
    })

    window.addEventListener('cerebral.dev.toggleKeepState', function () {
      willKeepState = !willKeepState
      update()
    })

    window.addEventListener('cerebral.dev.toggleDisableDebugger', function () {
      disableDebugger = !disableDebugger
      if (disableDebugger && willKeepState) {
        willKeepState = !willKeepState
      }
      var event = new CustomEvent('cerebral.dev.update', {
        detail: getDetail()
      })
      window.dispatchEvent(event)
    })

    window.addEventListener('cerebral.dev.resetStore', function () {
      signalStore.reset()
      controller.emit('change')
      update()
    })

    window.addEventListener('cerebral.dev.remember', function (event) {
      signalStore.remember(event.detail)
      update()
    })

    window.addEventListener('cerebral.dev.rememberNow', function (event) {
      signalStore.rememberNow()
      update()
    })

    window.addEventListener('cerebral.dev.rewrite', function (event) {
      signalStore.remember(event.detail)
      var signals = signalStore.getSignals()
      signals.splice(event.detail + 1, signals.length - 1 - event.detail)
      update()
    })

    window.addEventListener('cerebral.dev.logPath', function (event) {
      var name = event.detail.name
      var value = controller.get(event.detail.path)
      // toValue instead?
      console.log('CEREBRAL - ' + name + ':', value.toJS ? value.toJS() : value)
    })

    window.addEventListener('cerebral.dev.logModel', function (event) {
      console.log('CEREBRAL - model:', controller.logModel())
    })

    window.addEventListener('unload', function () {
      signalStore.removeRunningSignals()

      if (utils.hasLocalStorage()) {
        localStorage.setItem('cerebral_signals', isInitialized && willKeepState ? JSON.stringify(signalStore.getSignals()) : JSON.stringify([]))
        localStorage.setItem('cerebral_willKeepState', isInitialized && JSON.stringify(willKeepState))
        localStorage.setItem('cerebral_disable_debugger', isInitialized && JSON.stringify(disableDebugger))
      }
    })

    var services = {
      update: update,
      start: function () {
        console.warn('Cerebral: devtools.start() method is deprecated. Devtools has started automatically.')
      }
    }

    module.services(services)

    controller.getDevtools = function () {
      console.warn('Cerebral: controller.getDevtools() method is deprecated. Please upgrade your view package to latest version.')
      return services
    }

    if (window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__) {
      window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__.signals = controller.getSignals()
    }
    var event = new CustomEvent('cerebral.dev.cerebralPing')
    window.dispatchEvent(event)

    controller.on('signalStart', update)
    controller.on('actionStart', update)
    controller.on('actionEnd', update)
    controller.on('signalEnd', update)
  }
}
