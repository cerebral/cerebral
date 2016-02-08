var createStateArg = function (action, model, isAsync, compute) {
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
          return compute.getComputedValue(arguments[0])
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
          path = [args.shift()]
        }
        action.mutations.push({
          name: mutator,
          path: parentPath.concat(path),
          args: args
        })
        return model.mutators[mutator].apply(null, [parentPath.concat(path)].concat(args))
      }
      return state
    }, state)

    state.select = function (path) {
      return createStateObject(typeof path === 'string' ? path.split('.') : path)
    }

    return state
  }

  return createStateObject([])
}

var convertServices = function (action, path, modulesPaths, services, proto) {
  return Object.keys(services).reduce(function (newservices, key) {
    path.push(key)
    if (
      typeof services[key] === 'function' &&
      services[key].constructor.name === 'Function' &&
      !Object.keys(services[key]).length &&
      !Object.keys(services[key].prototype).length
    ) {
      var servicePath = path.slice()
      var method = servicePath.pop()
      newservices[key] = function () {
        action.serviceCalls.push({
          name: servicePath.join('.'),
          method: method,
          args: [].slice.call(arguments)
        })
        return services[key].apply(this, arguments)
      }
    } else if (
      typeof services[key] === 'object' &&
      !Array.isArray(services[key]) &&
      services[key] !== null &&
      modulesPaths.indexOf(path.join('.')) >= 0
    ) {
      newservices[key] = convertServices(action, path, modulesPaths, services[key], proto)
    } else {
      newservices[key] = services[key]
    }
    path.pop(key)
    return newservices
  }, {})
}

var createServicesArg = function (action, services, modules) {
  var path = []
  return convertServices(action, path, modules, services)
}

module.exports = {
  sync: function (action, signalArgs, model, compute, services, modulesPaths) {
    return [
      signalArgs,
      createStateArg(action, model, false, compute),
      createServicesArg(action, services, modulesPaths)
    ]
  },
  async: function (action, signalArgs, model, compute, services, modulesPaths) {
    return [
      signalArgs,
      createStateArg(action, model, true, compute),
      createServicesArg(action, services, modulesPaths)
    ]
  }
}
