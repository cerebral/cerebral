class Module {
  constructor (controller, path, moduleDescription) {
    const moduleStub = {
      controller,
      path: path.join('.'),
      name: path.slice().pop()
    }

    const module = typeof moduleDescription === 'function' ? moduleDescription(moduleStub) : moduleDescription

    controller.getModel().set(path, module.state || {})
    module.modules = Object.keys(module.modules || {}).reduce((registered, moduleKey) => {
      registered[moduleKey] = new Module(controller, path.concat(moduleKey), module.modules[moduleKey])
      return registered
    }, {})

    return module
  }
}

export default Module
