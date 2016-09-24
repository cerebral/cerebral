import FunctionTree from 'function-tree'
import Module from './Module'
import DefaultModel from './DefaultModel'
import {ensurePath, isDeveloping, throwError} from './utils'
import VerifyInputProvider from './providers/VerifyInput'
import ContextProvider from 'function-tree/providers/Context'
import StateProvider from './providers/State'
import DebuggerProvider from './providers/Debugger'
import ControllerProvider from './providers/Controller'
import {EventEmitter} from 'events'
import {dependencyStore as computedDependencyStore} from './Computed'

class Controller extends EventEmitter {
  constructor({state = {}, routes = {}, signals = {}, providers = [], modules = {}, router, devtools}) {
    super()
    this.flush = this.flush.bind(this)
    this.devtools = devtools
    this.model = new DefaultModel({})
    this.module = new Module([], () => ({
      state,
      routes,
      signals,
      modules
    }), {controller: this})
    this.router = router ? router(this.module.getRoutes(), this) : null

    const allProviders = (
      this.router ? [
        this.router.provider
      ] : []
    ).concat((
      this.devtools ? [
        DebuggerProvider(this.devtools)
      ] : []
    )).concat((
      isDeveloping() ? [
        VerifyInputProvider
      ] : []
    )).concat(
      ControllerProvider(this),
      StateProvider(this.model)
    ).concat(
      providers.concat(this.module.getProviders())
        .map(provider => typeof provider === 'function' ? provider : ContextProvider(provider))
    )

    this.runTree = new FunctionTree(allProviders)
    this.runTree.on('asyncFunction', this.flush)
    this.runTree.on('end', this.flush)

    if (this.devtools) {
      this.devtools.init(this)
      window.addEventListener('cerebral2.debugger.changeModel', (event) => {
        this.model.set(event.detail.path, event.detail.value)
        this.flush()
      })
    }

    if (this.router) this.router.init()
  }
  flush() {
    const changes = this.model.flush()
    const dirtyComputeds = computedDependencyStore.getUniqueEntities(changes)

    dirtyComputeds.forEach((computed) => {
      computed.flag()
    })
    this.emit('flush', changes)
  }
  getModel() {
    return this.model
  }
  getState(path) {
    return this.model.get(ensurePath(path))
  }
  runSignal(name, signal, payload) {
    this.runTree(name, signal, payload || {})
  }
  getSignal(path) {
    const pathArray = ensurePath(path)
    const signalKey = pathArray.pop()
    const module = pathArray.reduce((currentModule, key) => {
      return currentModule.modules[key]
    }, this.module)
    const signal = module.signals[signalKey]

    if (!signal) {
      throwError(`There is no signal at path "${path}"`)
    }

    return this.runSignal.bind(this, path, signal)
  }
}

export default function(...args) {
  return new Controller(...args)
}
