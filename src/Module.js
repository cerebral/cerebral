class Module {
  constructor(path, module, controller) {
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
    this.routes = moduleDescription.routes || {}
    this.provider = moduleDescription.provider
    this.registerModules(moduleDescription.modules || {})
  }
  /*
    Returns the routes defined on this module, but relative to
    the module path. So "/foo" becomes "/moduleName/foo"
  */
  getRoutes() {
    return Object.keys(this.modules).reduce((currentRoutes, moduleKey) => {
      return Object.assign({}, currentRoutes, this.modules[moduleKey].getRoutes())
    }, Object.keys(this.routes).reduce((currentInitialRoutes, routeKey) => {
      if (typeof this.routes[routeKey] === 'string') {
        currentInitialRoutes[(this.path.length ? `/${this.path.join('/') + routeKey}` : this.path.join('/') + routeKey)] = this.path.length ? `${this.path.join('.')}.${this.routes[routeKey]}` : this.routes[routeKey]
      } else {
        currentInitialRoutes[(this.path.length ? `/${this.path.join('/')}` : '') + routeKey] = Object.keys(this.routes[routeKey]).reduce((nestedRoutes, nestedKey) => {
          nestedRoutes[nestedKey] = this.path.length ? `${this.path.join('.')}.${this.routes[routeKey][nestedKey]}` : this.routes[routeKey][nestedKey]

          return nestedRoutes
        }, {})
      }

      return currentInitialRoutes
    }, {}))
  }
  registerModules(modules) {
    Object.keys(modules).forEach(moduleKey => {
      this.modules[moduleKey] = new Module(this.path.concat(moduleKey), modules[moduleKey], this.controller)
    })
  }
  /*
    Used by controller to extract all the providers of all modules
  */
  getProviders() {
    return (this.provider ? [this.provider] : []).concat(Object.keys(this.modules)
      .reduce((nestedProviders, moduleKey) => {
        return nestedProviders.concat(this.modules[moduleKey].getProviders())
      }, [])
    )
  }
}

export default Module
