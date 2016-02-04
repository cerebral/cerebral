var win = typeof window !== 'undefined' ? window : null
var doc = typeof document !== 'undefined' ? document : null

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
          path: path.slice(),
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

var recreateProtoChain = function (action, path, objectReferences, obj) {
  var protos = []
  var currentProto = Object.getPrototypeOf(obj)
  while (currentProto !== Object.getPrototypeOf({})) {
    protos.push(currentProto)
    currentProto = Object.getPrototypeOf(currentProto)
  }
  if (protos.length) {
    return protos.reverse().reduce(function (protoChain, proto) {
      return convertServices(action, path, objectReferences, proto, protoChain)
    }, {})
  } else {
    return null
  }
}

var convertServices = function (action, path, objectReferences, services, proto) {
  return Object.keys(services).reduce(function (newservices, key) {
    path.push(key)
    if (typeof services[key] === 'function') {
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
      Object.keys(services[key]).forEach(function (serviceKey) {
        if (typeof services[key][serviceKey] === 'function') {
          newservices[key][serviceKey] = function () {
            action.serviceCalls.push({
              name: servicePath.concat(method).join('.'),
              method: serviceKey,
              args: [].slice.call(arguments)
            })
            return services[key][serviceKey].apply(this, arguments)
          }
        } else {
          newservices[key][serviceKey] = services[key][serviceKey]
        }
      })
    } else if (
      typeof services[key] === 'object' &&
      !Array.isArray(services[key]) &&
      services[key] !== null &&
      objectReferences.indexOf(services[key]) === -1 &&
      (!win || !(services[key] instanceof win.HTMLElement))
    ) {
      var proto = recreateProtoChain(action, path, objectReferences, services[key])
      objectReferences.push(services[key])
      newservices[key] = convertServices(action, path, objectReferences, services[key], proto)
    } else {
      newservices[key] = services[key]
    }
    path.pop(key)
    return newservices
  }, proto ? Object.create(proto) : {})
}

var createServicesArg = function (action, services) {
  var path = []
  var objectReferences = [win, doc]
  return convertServices(action, path, objectReferences, services)
}

module.exports = {
  sync: function (action, signalArgs, model, compute, services) {
    return [
      signalArgs,
      createStateArg(action, model, false, compute),
      createServicesArg(action, services)
    ]
  },
  async: function (action, signalArgs, model, compute, services) {
    return [
      signalArgs,
      createStateArg(action, model, true, compute),
      createServicesArg(action, services)
    ]
  }
}
