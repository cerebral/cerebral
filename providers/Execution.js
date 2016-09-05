const executeTree = require('../src/executeTree')

function ExecutionProvider(execution) {
  return function(context) {
    context.execution = execution
    context.execution.retry = function (payload) {
      return new Promise(function (resolve) {
        executeTree(execution.staticTree, execution.runFunction, payload, function() {
          resolve()
        })
      })
    }

    return context
  }
}

module.exports = ExecutionProvider
