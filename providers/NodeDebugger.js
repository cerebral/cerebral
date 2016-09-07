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

  function traverseBranch(branch, functions, level) {
    return branch.reduce(function (logs, item) {
      if (Array.isArray(item)) {
        return logs.concat(traverseBranch(item, functions, level + 1))
      }
      return logs.concat(
        padded(chalk.underline.white(item.name), level),
        padded(
          chalk.dim(
            functions[item.functionIndex] ?
              JSON.stringify(functions[item.functionIndex].payload || {})
            :
              JSON.stringify({})
          ),
          level
        )
      )
      .concat(
        functions[item.functionIndex] ?
          functions[item.functionIndex].data.map(function (data) {
            return [
              padded(chalk[data.color || 'white'](data.method), level)
            ]
            .concat(
              (data.args || []).map(function (arg) {
                return JSON.stringify(arg)
              })
            ).join(' ')
          })
        :
          []
      )
      .concat(Object.keys(item.outputs || {}).reduce(function (currentOutputs, outputKey) {
        return currentOutputs.concat(
          padded(chalk.dim.underline.white(outputKey), level)
        ).concat(traverseBranch(item.outputs[outputKey], functions, level + 1))
      }, []))
    }, [])
  }

  function traverseFunctionTree(functionTree) {
    return traverseBranch(functionTree.staticTree, functionTree.functions, 0)
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
      prevFunction.data = prevFunction.data.concat(functionDetails.data)
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
      var args = data.args || []
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
          if (prevFunction.outputs[outputKey].length && prevFunction.outputs[outputKey][0].functionIndex === functionDetails.functionIndex) {
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
