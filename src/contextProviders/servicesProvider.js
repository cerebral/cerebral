var convertServices = function (action, path, modulesPaths, services) {
  return Object.keys(services).reduce(function (newservices, key) {
    path.push(key)
    if (
      typeof services[key] === 'function' &&
      services[key].constructor.name === 'Function' &&
      !Object.keys(services[key]).length &&
      (!services[key].prototype || !Object.keys(services[key].prototype).length)
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
      newservices[key] = convertServices(action, path, modulesPaths, services[key])
    } else {
      newservices[key] = services[key]
    }
    path.pop(key)
    return newservices
  }, {})
}

module.exports = function (action, modules, services) {
  return function (context) {
    var path = []
    context.services = convertServices(action, path, Object.keys(modules), services)

    return context
  }
}
