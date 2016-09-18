import FunctionTree from 'function-tree'
import ContextProvider from 'function-tree/providers/Context'

class Module {
  constructor(path, module, parentModule) {
    this.name = path.slice().pop()
    this.path = path
    this.controller = parentModule.controller
    this.modules = {}

    const moduleDescription = typeof module === 'function' ? module(this) : module

    this.initialState = moduleDescription.state || {}
    if (moduleDescription.state) {
      this.controller.getModel().set(this.path, moduleDescription.state)
    }

    this.signals = moduleDescription.signals || {}

    this.providers = (parentModule.providers).concat(
      (moduleDescription.providers || [])
        .map(provider => typeof provider === 'function' ? provider : ContextProvider(provider))
    )

    this.registerModules(moduleDescription.modules || {})

    this.runTree = new FunctionTree(this.providers)
    this.runTree.on('asyncFunction', () => {
      this.controller.emit('flush', this.controller.model.flush())
    })
    this.runTree.on('end', () => {
      this.controller.emit('flush', this.controller.model.flush())
    })
  }
  registerModules(modules) {
    Object.keys(modules).forEach(moduleKey => {
      this.modules[moduleKey] = new Module(this.path.concat(moduleKey), modules[moduleKey], this)
    })
  }
  runSignal(name, signal, payload) {
    this.runTree(name, signal, payload || {})
  }
}

export default Module
