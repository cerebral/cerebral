var createStateArg = function (action, model, isAsync, compute) {
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
      return model.accessors[accessor].apply(null, [path].concat(args))
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
        path: path.slice(),
        args: args
      })
      return model.mutators[mutator].apply(null, [path.slice()].concat(args))
    }
    return state
  }, state)

  return state
}

var createServicesArg = function (action, services, moduleKeys) {
  var path = []
  var objectReferences = []

  var convertServices = function (moduleServices) {
    return Object.keys(moduleServices).reduce(function (newModuleServices, key) {
      path.push(key)
      if (typeof moduleServices[key] === 'function') {
        var servicePath = path.slice()
        var method = servicePath.pop()
        newModuleServices[key] = function () {
          action.serviceCalls.push({
            name: servicePath.join('.'),
            method: method,
            args: [].slice.call(arguments)
          })
          return moduleServices[key].apply(moduleServices[key], arguments)
        }
      } else if (
        typeof moduleServices[key] === 'object' &&
        !Array.isArray(moduleServices[key]) &&
        moduleServices[key] !== null &&
        objectReferences.indexOf(moduleServices[key]) === -1
      ) {
        objectReferences.push(moduleServices[key])
        newModuleServices[key] = convertServices(moduleServices[key])
      } else {
        newModuleServices[key] = moduleServices[key]
      }
      path.pop(key)
      return newModuleServices
    }, {})
  }

  return Object.keys(services).reduce(function (newServices, key) {
    path.push(key)
    newServices[key] = convertServices(services[key], key)
    path.pop(key)
    return newServices
  }, {})
}

module.exports = {
  sync: function (action, signalArgs, model, compute, services, moduleKeys) {
    return [
      signalArgs,
      createStateArg(action, model, false, compute),
      createServicesArg(action, services, moduleKeys)
    ]
  },
  async: function (action, signalArgs, model, compute, services, moduleKeys) {
    return [
      signalArgs,
      createStateArg(action, model, true, compute),
      createServicesArg(action, services, moduleKeys)
    ]
  }
}
