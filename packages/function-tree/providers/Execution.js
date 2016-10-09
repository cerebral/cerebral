const executeTree = require('../src/executeTree')

module.exports = function ExecutionProvider(execution, Abort) {
  return function(context) {
    context.execution = execution
    context.execution.retry = function (payload) {
      return new Promise(function (resolve) {
        executeTree(execution.staticTree, execution.runFunction, payload, function() {
          resolve()
        })
      })
    }
    context.execution.abort = function () {
      return new Abort()
    }

    return context
  }
}
