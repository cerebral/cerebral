class Module {
  constructor (controller, path, moduleDescription) {
    const moduleStub = {
      controller,
      path: path.join('.'),
      name: path.slice().pop()
    }

    const module = typeof moduleDescription === 'function' ? moduleDescription(moduleStub) : moduleDescription

    /* Set initial module state to model */
    controller.getModel().set(path, module.state || {})
    /* Convert arrays to actually runable signals */
    module.signals = Object.keys(module.signals || {}).reduce((currentSignals, signalKey) => {
      const signal = module.signals[signalKey]

      currentSignals[signalKey] = (payload) => {
        controller.runSignal(path.concat(signalKey).join('.'), signal, payload)
      }

      return currentSignals
    }, {})

    /* Instantiate submodules */
    module.modules = Object.keys(module.modules || {}).reduce((registered, moduleKey) => {
      registered[moduleKey] = new Module(controller, path.concat(moduleKey), module.modules[moduleKey])
      return registered
    }, {})

    return module
  }
}

export default Module
