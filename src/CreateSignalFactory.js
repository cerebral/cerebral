var utils = require('./utils.js')
var createNext = require('./createNext.js')
var analyze = require('./analyze.js')
var staticTree = require('./staticTree')
var createContext = require('./createContext')
var inputProvider = require('./contextProviders/inputProvider')
var stateProvider = require('./contextProviders/stateProvider')
var servicesProvider = require('./contextProviders/servicesProvider')
var outputProvider = require('./contextProviders/outputProvider')

var requestAnimationFrame = global.requestAnimationFrame || function (cb) {
  setTimeout(cb, 0)
}

module.exports = function (controller, model, services, compute, modules) {
  var currentlyRunningSignals = 0
  var batchedSignals = []
  var pending = false

  controller.isExecuting = function () {
    return Boolean(currentlyRunningSignals)
  }

  return function () {
    var args = [].slice.call(arguments)
    var signalName = args.shift()
    var defaultOptions = args[1] || {}

    var chain = args[0] || []

    if (utils.isDeveloping()) {
      analyze(signalName, chain)
    }

    var signalChain = function (payload, passedOptions) {
      var defaultOptionsCopy = Object.keys(defaultOptions).reduce(function (defaultOptionsCopy, key) {
        defaultOptionsCopy[key] = defaultOptions[key]
        return defaultOptionsCopy
      }, {})
      var options = Object.keys(passedOptions || {}).reduce(function (defaultOptionsCopy, key) {
        defaultOptionsCopy[key] = passedOptions[key]
        return defaultOptionsCopy
      }, defaultOptionsCopy)

      var tree = staticTree(signalChain.chain)
      var actions = tree.actions

      var signal = {
        name: signalName,
        start: null,
        isSync: options.immediate,
        isExecuting: false,
        isPrevented: false,
        branches: tree.branches,
        duration: 0,
        input: payload,
        preventSignalRun: function () {
          if (signal.isExecuting === false) signal.isPrevented = true
        }
      }

      var isPredefinedExecution = false
      if (options.branches) {
        signal.isSync = true
        signal.branches = options.branches
        isPredefinedExecution = true
        controller.emit('predefinedSignal', { signal: signal, options: options, payload: payload })
      } else {
        var prevIsSync = signal.isSync
        controller.emit('signalTrigger', { signal: signal, options: options, payload: payload })
        if (prevIsSync !== signal.isSync) {
          console.warn('Cerebral: You are running an older version of the cerebral-module-router. Please update the package')
        }
      }

      if (signal.isPrevented) {
        return
      }

      var runSignal = function () {
        // Accumulate the args in one object that will be passed
        // to each action
        var signalArgs = utils.merge({}, payload || {})

        // Test payload
        if (utils.isDeveloping()) {
          try {
            JSON.stringify(signalArgs)
          } catch (e) {
            console.log('Not serializable', signalArgs)
            throw new Error('Cerebral - Could not serialize input to signal. Please check signal ' + signalName)
          }
        }

        signal.start = Date.now()
        signal.isExecuting = true

        if (!isPredefinedExecution) {
          currentlyRunningSignals++
          controller.emit('signalStart', {signal: signal, options: options, payload: payload})
        }

        var runBranch = function (branch, index, start) {
          var currentBranch = branch[index]
          if (!currentBranch && branch === signal.branches && !isPredefinedExecution) {
            // Might not be any actions passed
            if (branch[index - 1]) {
              branch[index - 1].duration = Date.now() - start
            }

            signal.isExecuting = false
            currentlyRunningSignals--
            controller.emit('signalEnd', {signal: signal, options: options, payload: payload})
            controller.emit('change', {signal: signal, options: options, payload: payload})
            return
          }

          if (!currentBranch) {
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

                utils.merge(signalArgs, action.output)

                if (action.outputPath) {
                  runBranch(action.outputs[action.outputPath], 0)
                }
              })

              runBranch(branch, index + 1)
            } else {
              var promises = currentBranch.map(function (action) {
                controller.emit('actionStart', {action: action, signal: signal, options: options, payload: payload})
                var actionFunc = actions[action.actionIndex]
                var inputArg = actionFunc.defaultInput ? utils.merge({}, actionFunc.defaultInput, signalArgs) : signalArgs
                var next = createNext.async(actionFunc, signal.name)
                var context = createContext([
                  inputProvider(inputArg),
                  stateProvider(action, model, compute, true),
                  servicesProvider(action, modules, services),
                  outputProvider(next.fn)
                ].concat(options.context || []))

                if (utils.isDeveloping() && actionFunc.input) {
                  utils.verifyInput(action.name, signal.name, actionFunc.input, inputArg)
                }

                action.isExecuting = true
                action.input = utils.merge({}, inputArg)

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

                return next.promise.then(function (result) {
                  action.hasExecuted = true
                  action.isExecuting = false
                  action.output = utils.merge({}, result.arg)
                  utils.merge(signalArgs, result.arg)

                  controller.emit('actionEnd', {action: action, signal: signal, options: options, payload: payload})
                  controller.emit('change', {signal: signal, options: options, payload: payload})

                  if (result.path) {
                    action.outputPath = result.path
                    var branchResult = runBranch(action.outputs[result.path], 0, Date.now())
                    return branchResult
                  }
                })
              })
              controller.emit('change', {signal: signal, options: options, payload: payload})
              return Promise.all(promises)
                .then(function () {
                  return runBranch(branch, index + 1, Date.now())
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
                model.mutators[mutation.name].apply(null, [mutation.path.slice()].concat(mutation.args))
              })

              if (action.outputPath) {
                runBranch(action.outputs[action.outputPath], 0)
              }

              runBranch(branch, index + 1)
            } else {
              controller.emit('actionStart', {action: action, signal: signal, options: options, payload: payload})

              var actionFunc = actions[action.actionIndex]
              var inputArg = actionFunc.defaultInput ? utils.merge({}, actionFunc.defaultInput, signalArgs) : signalArgs
              var next = createNext.sync(actionFunc, signal.name)
              var context = createContext([
                inputProvider(inputArg),
                stateProvider(action, model, compute, false),
                servicesProvider(action, modules, services),
                outputProvider(next)
              ].concat(options.context || []))

              if (utils.isDeveloping() && actionFunc.input) {
                utils.verifyInput(action.name, signal.name, actionFunc.input, inputArg)
              }

              action.mutations = [] // Reset mutations array
              action.input = utils.merge({}, inputArg)

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

              // TODO: Also add input here

              var result = next._result || {}
              utils.merge(signalArgs, result.arg)

              action.isExecuting = false
              action.hasExecuted = true
              action.output = utils.merge({}, result.arg)

              if (!branch[index + 1] || Array.isArray(branch[index + 1])) {
                action.duration = Date.now() - start
              }

              if (result.path) {
                action.outputPath = result.path
                var branchResult = runBranch(action.outputs[result.path], 0, start)
                if (branchResult && branchResult.then) {
                  return branchResult.then(function () {
                    return runBranch(branch, index + 1, Date.now())
                  })
                } else {
                  return runBranch(branch, index + 1, start)
                }
              } else if (result.then) {
                return result.then(function () {
                  controller.emit('actionEnd', {action: action, signal: signal, options: options, payload: payload})

                  return runBranch(branch, index + 1, start)
                })
              } else {
                controller.emit('actionEnd', {action: action, signal: signal, options: options, payload: payload})

                return runBranch(branch, index + 1, start)
              }
            }
          }
        }

        runBranch(signal.branches, 0, Date.now())

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
    signalChain.chain = chain
    signalChain.signalName = signalName

    return signalChain
  }
}
