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
          padded(chalk.dim.white(outputKey), level)
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
    if (registeredFunctionTrees[id] && registeredFunctionTrees[id].functions[functionDetails.functionIndex]) {
      registeredFunctionTrees[id].functions[functionDetails.functionIndex].data.push(debuggingData)
    } else if (registeredFunctionTrees[id]) {
      registeredFunctionTrees[id].functions[functionDetails.functionIndex] = {
        payload: payload,
        data: []
      }
    } else {
      registeredFunctionTrees[id] = {
        staticTree: context.execution.staticTree,
        functions: [{
          payload: payload,
          data: []
        }]
      }
    }

    if (!registeredFunctionTrees[id].isBatching) {
      registeredFunctionTrees[id].isBatching = true
      setTimeout(function () {
        console.log([
          chalk.bgWhite.black.bold(padded(context.execution.name || context.execution.id)),
        ].concat(traverseFunctionTree(registeredFunctionTrees[id])).join('\n'));
        registeredFunctionTrees[id].isBatching = false
      })
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
