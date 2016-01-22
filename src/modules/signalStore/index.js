/*
  SignalStore will keep track of all signals triggered. It keeps an array of signals with
  actions and mutations related to that signal. It will also track any async signals processing. The SignalStore
  is able to reset state and travel to a "specific point in time" by playing back the signals up to a certain
  signal.
*/
var utils = require('./../../utils.js')

module.exports = function SignalStore () {
  return function (module, controller) {
    var signals = []
    var willKeepState = false
    var isRemembering = false
    var currentIndex = signals.length - 1
    var hasRememberedInitial = false

    var asyncActionsRunning = []

    var services = {
      // Flips flag of storing signals or replacing them
      toggleKeepState: function () {
        willKeepState = !willKeepState
      },

      addAsyncAction: function (action) {
        asyncActionsRunning.push(action)
      },

      removeAsyncAction: function (action) {
        asyncActionsRunning.splice(asyncActionsRunning.indexOf(action), 1)
      },

      addSignal: function (signal) {
        if (utils.isDeveloping() && !isRemembering) {
          if (asyncActionsRunning.length) {
            var currentAction = asyncActionsRunning[asyncActionsRunning.length - 1]
            currentAction.signals = currentAction.signals || []
            currentAction.signals.push(signal)
          } else {
            currentIndex++
            signals.push(signal)
          }
        }
      },

      // This is used when loading up the app and producing the last known state
      rememberNow: function () {
        if (!signals.length) {
          return
        }

        currentIndex = signals.length - 1
        this.remember(currentIndex)
      },

      // Will reset the SignalStore
      reset: function () {
        if (!isRemembering) {
          signals = []

          currentIndex = -1

          controller.emit('reset')
        }
      },

      rememberInitial: function (index) {
        // Both router and debugger might try to do initial remembering
        if (hasRememberedInitial) {
          return
        }

        hasRememberedInitial = true
        this.remember(index)
      },
      remember: function (index) {
        // Flag that we are remembering
        isRemembering = true
        controller.emit('reset')

        // If going back to initial state, just return and update
        if (index === -1) {
          currentIndex = index
          isRemembering = false
        } else {
          // Start from beginning
          currentIndex = -1

          // Go through signals
          try {
            for (var x = 0; x <= index; x++) {
              var signal = signals[x]
              if (!signal) {
                break
              }

              // Trigger signal and then set what has become the current signal
              var signalMethodPath = signal.name.split('.').reduce(function (signals, key) {
                return signals[key]
              }, controller.getSignals())
              signalMethodPath(signal.input, {
                branches: signal.branches
              })
              currentIndex = x
            }
          } catch (e) {
            console.log(e)
            console.warn('CEREBRAL - There was an error remembering state, it has been reset')
            this.reset()
          }
        }

        controller.emit('change')
        isRemembering = false
      },

      removeRunningSignals: function () {
        for (var x = 0; x < signals.length; x++) {
          if (signals[x].isExecuting) {
            signals.splice(x, 1)
            x--
          }
        }
      },

      getSignals: function () {
        return signals
      },

      setSignals: function (newSignals) {
        signals = signals.concat(newSignals)
      },

      isExecutingAsync: function () {
        return !!asyncActionsRunning.length
      },

      isRemembering: function () {
        return isRemembering
      },

      willKeepState: function () {
        return willKeepState
      },

      getCurrentIndex: function () {
        return currentIndex
      }
    }

    controller.getStore = function getStore () {
      return services
    }

    controller.on('signalStart', function (args) {
      var signal = args.signal

      if (isRemembering && currentIndex !== -1 && currentIndex < signals.length - 1) {
        signal.preventSignalRun()
        console.warn('Cerebral - Looking in the past, ignored signal ' + signal.name)
      }

      services.addSignal(signal)
    })
    controller.on('actionStart', function (args) {
      var action = args.action
      if (action.isAsync) services.addAsyncAction(args.action)
    })
    controller.on('actionEnd', function (args) {
      var action = args.action
      if (action.isAsync) services.removeAsyncAction(args.action)
    })
  }
}
