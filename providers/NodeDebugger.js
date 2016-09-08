var chalk = require('chalk')

module.exports = function (options) {
  options = options || {}
  var colors = options.colors || {}

  if (
      typeof window !== 'undefined' &&
      (
        typeof window.chrome !== 'undefined' ||
        process && process.versions && process.versions.electron
      )
    ) {
    throw new Error('function-tree: You are running the Node debugger, but the Chrome debugger is supported')
  }

  function padded(text, size) {
    size = size || 0
    var padding = new Array(size + 1).join(' ')
    return padding + text + padding
  }

  var registeredFunctionTrees = {}

  function send(debuggingData, context, functionDetails, payload) {
    var id = context.execution.id + '_' + context.execution.executionId
    var prevFunction = (
      registeredFunctionTrees[id] &&
      registeredFunctionTrees[id].functions[registeredFunctionTrees[id].functions.length - 1]
    )

    var isExistingFunction = Boolean(prevFunction && prevFunction.functionIndex === functionDetails.functionIndex)

    if (registeredFunctionTrees[id] && registeredFunctionTrees[id].functions[functionDetails.functionIndex]) {
      registeredFunctionTrees[id].functions[functionDetails.functionIndex].data.push(debuggingData)
    } else if (isExistingFunction) {
      prevFunction.data = prevFunction.data.concat(debuggingData)
    } else if (registeredFunctionTrees[id]) {
      registeredFunctionTrees[id].functions.push({
        functionIndex: functionDetails.functionIndex,
        outputs: functionDetails.outputs,
        payload: payload,
        data: []
      })
    } else {
      registeredFunctionTrees[id] = {
        logLevel: 0,
        staticTree: context.execution.staticTree,
        functions: [{
          functionIndex: functionDetails.functionIndex,
          outputs: functionDetails.outputs,
          payload: payload,
          data: []
        }]
      }
    }

    if (isExistingFunction) {

      var data = prevFunction.data[prevFunction.data.length - 1]
      var args = data ? data.args || [] : []
      console.log.apply(console,
        [padded(chalk[data.color || 'white'](data.method), registeredFunctionTrees[id].logLevel)].concat(
          args.map(function (arg) {
            return padded(chalk.white(JSON.stringify(arg)), registeredFunctionTrees[id].logLevel)
          })
        )
      )


    } else {

      if (registeredFunctionTrees[id].functions.length === 1) {
        console.log(chalk.bgWhite.black.bold(padded(context.execution.name || context.execution.id)))
      }


      if (prevFunction && prevFunction.outputs) {
        var chosenOutput = Object.keys(prevFunction.outputs).filter(function (outputKey) {
          if (
            prevFunction.outputs[outputKey].length &&
            (
              ( // Might be an array which is the first element
                Array.isArray(prevFunction.outputs[outputKey][0]) &&
                prevFunction.outputs[outputKey][0][0].functionIndex === functionDetails.functionIndex
              ) ||
              prevFunction.outputs[outputKey][0].functionIndex === functionDetails.functionIndex
            )
          ) {
            return true
          }

          return false
        })[0]
        console.log(padded(chalk.dim.underline.white(chosenOutput), registeredFunctionTrees[id].logLevel))
        registeredFunctionTrees[id].logLevel++
      }

      console.log(padded(chalk.underline.white(functionDetails.name), registeredFunctionTrees[id].logLevel))
      console.log(padded(
        chalk.dim(JSON.stringify(payload || {})),
        registeredFunctionTrees[id].logLevel
      ))

    }
  }

  return function(context, functionDetails, payload) {
    context.debugger = {
      send: function (data) {
        send(data, context, functionDetails, payload)
      },
      getColor: function (key) {
        return options.colors[key] || 'white';
      }
    }

    send(null, context, functionDetails, payload)

    return context
  }}
