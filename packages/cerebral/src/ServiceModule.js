class ServiceModule {
  constructor (service, path, moduleDescription) {
    const moduleStub = {
      service,
      path: path.join('.'),
      name: path.slice().pop()
    }

    const module = typeof moduleDescription === 'function' ? moduleDescription(moduleStub) : moduleDescription

    /* Convert arrays to actually runable signals */
    module.signals = Object.keys(module.signals || {}).reduce((currentSignals, signalKey) => {
      const signal = module.signals[signalKey]

      currentSignals[signalKey] = (payload) => {
        service.runSignal(path.concat(signalKey).join('.'), signal, payload)
      }

      return currentSignals
    }, {})

    /* Instantiate submodules */
    module.modules = Object.keys(module.modules || {}).reduce((registered, moduleKey) => {
      registered[moduleKey] = new ServiceModule(service, path.concat(moduleKey), module.modules[moduleKey])
      return registered
    }, {})

    return module
  }
}

export default ServiceModule
