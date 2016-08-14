var utils = require('./utils.js')
var analyze = require('./analyze.js')
var staticTree = require('./staticTree')
var createContext = require('./createContext')
var inputProvider = require('../providers/inputProvider')
var stateProvider = require('../providers/stateProvider')
var servicesProvider = require('../providers/servicesProvider')
var outputProvider = require('../providers/outputProvider')
var deprecationProvider = require('../providers/deprecationProvider')

var requestAnimationFrame = global.requestAnimationFrame || function (cb) {
  setTimeout(cb, 0)
}

module.exports = function (controller, externalContextProviders) {
  var currentlyRunningSignals = 0
  var batchedSignals = []
  var pending = false

  controller.isExecuting = function () {
    return Boolean(currentlyRunningSignals)
  }

  return function (signalName, chain, defaultOptions) {
    if (utils.isDeveloping()) {
      analyze(signalName, chain || [])
    }

    var tree = staticTree(chain)
    var actions = tree.actions

    var signalChain = function (signalPayload, passedOptions) {
      var defaultOptionsCopy = Object.keys(defaultOptions || {}).reduce(function (defaultOptionsCopy, key) {
        defaultOptionsCopy[key] = defaultOptions[key]
        return defaultOptionsCopy
      }, {})

      if (utils.isDeveloping()) {
        tree = staticTree(chain)
        actions = tree.actions
      }

      var options = Object.keys(passedOptions || {}).reduce(function (defaultOptionsCopy, key) {
        defaultOptionsCopy[key] = passedOptions[key]
        return defaultOptionsCopy
      }, defaultOptionsCopy)

      var signal = {
        name: signalName,
        start: null,
        isSync: options.immediate,
        isExecuting: false,
        isPrevented: false,
        branches: tree.branches,
        duration: 0,
        preventSignalRun: function () {
          if (signal.isExecuting === false) signal.isPrevented = true
        }
      }

      var isPredefinedExecution = false
      if (options.branches) {
        signal.isSync = true
        signal.branches = options.branches
        isPredefinedExecution = true
        controller.emit('predefinedSignal', { signal: signal, options: options, payload: signalPayload })
      } else {
        controller.emit('signalTrigger', { signal: signal, options: options, payload: signalPayload })
      }

      if (signal.isPrevented) {
        return
      }

      var runSignal = function () {
        signal.start = Date.now()
        signal.isExecuting = true

        if (!isPredefinedExecution) {
          currentlyRunningSignals++
          controller.emit('signalStart', {signal: signal, options: options, payload: signalPayload})
        }

        var runBranch = function (branch, index, start, payload) {
          var currentBranch = branch[index]
          if (!currentBranch) {
            if (branch === signal.branches && !isPredefinedExecution) {
              // Might not be any actions passed
              if (branch[index - 1]) {
                branch[index - 1].duration = Date.now() - start
              }

              signal.isExecuting = false
              currentlyRunningSignals--
              controller.emit('signalEnd', {signal: signal, options: options, payload: payload})
              controller.emit('change', {signal: signal, options: options, payload: payload})
            }
            return
          }

          if (Array.isArray(currentBranch)) {
            if (isPredefinedExecution) {
              currentBranch.forEach(function (action) {
                // If any signals has run with this action, run them
                // as well
                if (action.signals) {
                  action.signals.forEach(function (signal) {
                    var signalMethodPath = signal.name.split('.').reduce(function (signals, key) {
                      return signals[key]
                    }, controller.getSignals())
                    signalMethodPath(signal.input, {branches: signal.branches})
                  })
                }

                if (action.outputPath) {
                  runBranch(action.outputs[action.outputPath], 0)
                }
              })

              runBranch(branch, index + 1)
            } else {
              var resolvedPromisesCount = 0
              var promises = currentBranch.map(function (action) {
                var resolver = null
                var promise = new Promise(function (resolve) {
                  resolver = resolve
                })
                controller.emit('actionStart', {
                  action: action,
                  signal: signal,
                  options: options,
                  payload: payload
                })
                var actionFunc = actions[action.actionIndex]

                var contextProviders = [
                  inputProvider,
                  stateProvider,
                  servicesProvider,
                  outputProvider
                ].concat(utils.extractExternalContextProviders(externalContextProviders, options.modulePath))
                .concat(utils.isDeveloping() ? deprecationProvider : [])
                var context = createContext(contextProviders, {
                  action: action,
                  signal: signal,
                  options: options,
                  payload: payload,
                  resolve: resolver
                }, controller)

                action.isExecuting = true

                if (utils.isDeveloping()) {
                  try {
                    actionFunc(context)
                  } catch (e) {
                    action.error = {
                      name: e.name,
                      message: e.message,
                      stack: actionFunc.toString()
                    }
                    controller.emit('signalError', {action: action, signal: signal, options: options, payload: payload})
                    controller.emit('change', {signal: signal, options: options, payload: payload})
                    throw e
                  }
                } else {
                  actionFunc(context)
                }

                return promise.then(function (resolvedAction) {
                  resolvedPromisesCount++
                  action.hasExecuted = true
                  action.isExecuting = false

                  controller.emit('actionEnd', {action: action, signal: signal, options: options, payload: payload})

                  var newPayload = utils.merge({}, payload, resolvedAction.payload)
                  if (resolvedAction.path) {
                    action.outputPath = resolvedAction.path
                    newPayload = runBranch(action.outputs[resolvedAction.path], 0, Date.now(), newPayload) || newPayload
                    if (!newPayload.then && resolvedPromisesCount !== currentBranch.length) {
                      controller.emit('change', {signal: signal, options: options, payload: newPayload})
                    }
                  }
                  return newPayload
                })
              })
              controller.emit('change', {signal: signal, options: options, payload: payload})
              return Promise.all(promises)
                .then(function (actionPayloads) {
                  var newPayload = utils.merge.apply(null, [{}, payload].concat(actionPayloads))
                  return runBranch(branch, index + 1, Date.now(), newPayload) || newPayload
                })
                .catch(function (error) {
                  // We just throw any unhandled errors
                  controller.emit('error', error)
                  throw error
                })
            }
          } else {
            var action = currentBranch

            if (isPredefinedExecution) {
              action.mutations.forEach(function (mutation) {
                controller.getModel().mutators[mutation.name].apply(null, [mutation.path.slice()].concat(mutation.args))
              })

              if (action.outputPath) {
                runBranch(action.outputs[action.outputPath], 0)
              }

              runBranch(branch, index + 1)
            } else {
              controller.emit('actionStart', {action: action, signal: signal, options: options, payload: payload})
              var resolvedAction = {path: null, payload: {}}
              var resolver = function (resolvedResult) {
                resolvedAction = resolvedResult
              }
              var actionFunc = actions[action.actionIndex]

              var contextProviders = [
                inputProvider,
                stateProvider,
                servicesProvider,
                outputProvider
              ].concat(utils.extractExternalContextProviders(externalContextProviders, options.modulePath))
              .concat(utils.isDeveloping() ? deprecationProvider : [])
              var context = createContext(contextProviders, {
                action: action,
                signal: signal,
                options: options,
                payload: payload,
                resolve: resolver
              }, controller)

              if (utils.isDeveloping()) {
                try {
                  actionFunc(context)
                } catch (e) {
                  action.error = {
                    name: e.name,
                    message: e.message,
                    stack: e.stack
                  }
                  controller.emit('signalError', {action: action, signal: signal, options: options, payload: payload})
                  controller.emit('change', {signal: signal, options: options, payload: payload})
                  throw e
                }
              } else {
                actionFunc(context)
              }

              action.isExecuting = false
              action.hasExecuted = true

              if (!branch[index + 1] || Array.isArray(branch[index + 1])) {
                action.duration = Date.now() - start
              }

              var branchResult = null
              var newPayload = utils.merge({}, payload, resolvedAction.payload)

              if (resolvedAction.path) {
                action.outputPath = resolvedAction.path
                controller.emit('actionEnd', {action: action, signal: signal, options: options, payload: payload})
                branchResult = runBranch(action.outputs[resolvedAction.path], 0, start, utils.merge({}, payload, resolvedAction.payload))
                if (branchResult && branchResult.then) {
                  return branchResult.then(function (payload) {
                    return runBranch(branch, index + 1, Date.now(), utils.merge({}, payload, resolvedAction.payload))
                  })
                } else {
                  return runBranch(branch, index + 1, start, utils.merge({}, newPayload, branchResult)) || newPayload
                }
              }

              controller.emit('actionEnd', {action: action, signal: signal, options: options, payload: payload})
              return runBranch(branch, index + 1, start, newPayload) || newPayload
            }
          }
        }

        runBranch(signal.branches, 0, Date.now(), signalPayload)

        return
      }

      if (signal.isSync) {
        runSignal()
      } else {
        batchedSignals.push(runSignal)

        if (!pending) {
          requestAnimationFrame(function () {
            while (batchedSignals.length) {
              batchedSignals.shift()()
            }
            pending = false
          })

          pending = true
        }
      }
    }
    signalChain.signalName = signalName

    return signalChain
  }
}
