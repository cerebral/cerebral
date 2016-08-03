module.exports = function (context, execution, controller) {
  var action = execution.action
  var model = controller.getModel()
  var isAsync = action.isAsync

  var createStateObject = function (parentPath) {
    var state = Object.keys(model.accessors || {}).reduce(function (state, accessor) {
      state[accessor] = function () {
        var args = [].slice.call(arguments)
        var path = []
        if (args[0] && Array.isArray(args[0])) {
          path = args.shift()
        } else if (args[0] && typeof args[0] === 'string') {
          path = args.shift().split('.')
        }
        if (accessor === 'get' && typeof arguments[0] === 'function') {
          return controller.get(arguments[0])
        }
        return model.accessors[accessor].apply(null, [parentPath.concat(path)].concat(args))
      }
      return state
    }, {})
    Object.keys(model.mutators || {}).reduce(function (state, mutator) {
      state[mutator] = function () {
        if (isAsync) {
          throw new Error('Cerebral: You can not mutate state in async actions. Output values and set them with a sync action')
        }
        var path = []
        var args = [].slice.call(arguments)
        if (Array.isArray(args[0])) {
          path = args.shift()
        } else if (typeof args[0] === 'string') {
          path = args.shift().split('.')
        }

        return model.mutators[mutator].apply(null, [parentPath.concat(path)].concat(args))
      }
      return state
    }, state)

    state.select = function (path) {
      return createStateObject(typeof path === 'string' ? path.split('.') : path)
    }

    state.computed = function (computed) {
      return computed.get(model.accessors.get([]), true)
    }

    return state
  }

  context.state = createStateObject([])

  return context
}
