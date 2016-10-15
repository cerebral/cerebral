class Module {
  constructor (path, module, controller) {
    this.name = path.slice().pop()
    this.path = path
    this.controller = controller
    this.modules = {}

    const moduleDescription = typeof module === 'function' ? module(this) : module

    this.initialState = moduleDescription.state || {}
    if (moduleDescription.state) {
      this.controller.getModel().set(this.path, moduleDescription.state)
    }

    this.signals = moduleDescription.signals || {}
    this.provider = moduleDescription.provider
    this.registerModules(moduleDescription.modules || {})
  }
  registerModules (modules) {
    Object.keys(modules).forEach(moduleKey => {
      this.modules[moduleKey] = new Module(this.path.concat(moduleKey), modules[moduleKey], this.controller)
    })
  }
  /*
    Used by controller to extract all the providers of all modules
  */
  getProviders () {
    return (this.provider ? [this.provider] : []).concat(Object.keys(this.modules)
      .reduce((nestedProviders, moduleKey) => {
        return nestedProviders.concat(this.modules[moduleKey].getProviders())
      }, [])
    )
  }
}

export default Module
