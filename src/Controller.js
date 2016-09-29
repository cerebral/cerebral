import FunctionTree from 'function-tree'
import Module from './Module'
import Model from './Model'
import {ensurePath, isDeveloping, throwError} from './utils'
import VerifyInputProvider from './providers/VerifyInput'
import ContextProvider from 'function-tree/providers/Context'
import StateProvider from './providers/State'
import DebuggerProvider from './providers/Debugger'
import ControllerProvider from './providers/Controller'
import {EventEmitter} from 'events'
import {dependencyStore as computedDependencyStore} from './Computed'

/*
  The controller is where everything is attached. The devtools
  and router is attached directly. Also a top level module is created.
  The controller creates the function tree that will run all signals,
  based on top level providers and providers defined in modules
*/
class Controller extends EventEmitter {
  constructor({state = {}, routes = {}, signals = {}, providers = [], modules = {}, router, devtools}) {
    super()
    this.flush = this.flush.bind(this)
    this.devtools = devtools
    this.model = new Model({}, Boolean(this.devtools && this.devtools.preventExternalMutations))
    this.module = new Module([], {
      state,
      routes,
      signals,
      modules
    }, this)
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
    }

    if (this.router) this.router.init()

    this.emit('initialized')
  }
  /*
    Whenever the view needs to be updated this method is called.
    It will first flag any computed for changes and then emit the flush
    event which the view layer listens to
  */
  flush() {
    const changes = this.model.flush()
    const computedsAboutToBecomeDirty = computedDependencyStore.getUniqueEntities(changes)

    computedsAboutToBecomeDirty.forEach((computed) => {
      computed.flag()
    })
    this.emit('flush', changes)
  }
  /*
    Conveniance method for grabbing the model
  */
  getModel() {
    return this.model
  }
  /*
    Method called by view to grab state
  */
  getState(path) {
    return this.model.get(ensurePath(path))
  }
  /*
    Uses function tree to run the array and optional
    payload passed in
  */
  runSignal(name, signal, payload) {
    this.runTree(name, signal, payload || {})
  }
  /*
    Returns a function which binds the name/path of signal,
    and the array. This allows view layer to just call it with
    an optional payload and it will run
  */
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
