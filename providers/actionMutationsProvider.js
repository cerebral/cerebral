/*
  ## Used by Recorder and SignalStore to replay signals
  Should evaluate how signals are replayed. Sometimes you want
  to actually run the signals again (recorder)
*/

function wrapMutators (target, mutators, action, rootPath) {
  return Object.keys(target).reduce(function (target, targetKey) {
    if (targetKey in mutators) {
      var originalMutator = target[targetKey]
      target[targetKey] = function () {
        var args = [].slice.call(arguments)
        var path = args.shift()
        action.mutations.push({
          name: targetKey,
          path: typeof path === 'string' ? rootPath.concat(path.split('.')) : rootPath.concat(path),
          args: args
        })
        originalMutator.apply(null, arguments)
      }
    }
    return target
  }, target)
}

module.exports = function (context, execution, controller) {
  var model = controller.getModel()
  var action = execution.action
  var originalSelect = context.state.select

  action.mutations = action.mutations || []
  context.state = wrapMutators(context.state, model.mutators, action, [])

  context.state.select = function (path) {
    var cursor = originalSelect(path)
    return wrapMutators(cursor, model.mutators, action, typeof path === 'string' ? path.split('.') : path)
  }

  return context
}
