/*
  ## Used by Recorder and SignalStore to replay signals
  Should evaluate how signals are replayed. Sometimes you want
  to actually run the signals again (recorder)
*/
module.exports = function (context, execution, controller) {
  var model = controller.getModel()
  var action = execution.action
  action.mutations = action.mutations || []

  return Object.keys(context).reduce(function (newContext, key) {
    newContext[key] = context[key]
    if (key === 'state') {
      Object.keys(model.mutators).forEach(function (mutatorKey) {
        var originalMutator = context[key][mutatorKey]
        newContext[key][mutatorKey] = function () {
          var args = [].slice.call(arguments)
          var path = args.shift()
          action.mutations.push({
            name: mutatorKey,
            path: typeof path === 'string' ? path.split('.') : path,
            args: args
          })
          originalMutator.apply(null, arguments)
        }
      })
    }

    return newContext
  }, {})
}
