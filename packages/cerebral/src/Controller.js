import FunctionTree from 'function-tree'
import Module from './Module'
import Model from './Model'
import {ensurePath, isDeveloping, throwError, isSerializable} from './utils'
import VerifyInputProvider from './providers/VerifyInput'
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
  constructor ({state = {}, signals = {}, providers = [], modules = {}, router, devtools = null, strictRender = false}) {
    super()
    this.strictRender = strictRender
    this.flush = this.flush.bind(this)
    this.devtools = devtools
    this.model = new Model({}, this.devtools)
    this.module = new Module([], {
      state,
      signals,
      modules
    }, this)
    this.router = router ? router(this) : null

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
    )

    this.runTree = new FunctionTree(allProviders)
    this.runTree.on('asyncFunction', this.flush)
    this.runTree.on('end', this.flush)

    if (this.devtools) {
      this.devtools.init(this)
    }

    if (this.router) this.router.init()

    this.signalsClass = new Signals(this)

    this.emit('initialized')
  }
  /*
    Whenever the view needs to be updated this method is called.
    It will first flag any computed for changes and then emit the flush
    event which the view layer listens to
  */
  flush () {
    const changes = this.model.flush()
    const computedsAboutToBecomeDirty = this.strictRender ? computedDependencyStore.getStrictUniqueEntities(changes) : computedDependencyStore.getUniqueEntities(changes)

    computedsAboutToBecomeDirty.forEach((computed) => {
      computed.flag()
    })
    this.emit('flush', changes)
  }
  /*
    Conveniance method for grabbing the model
  */
  getModel () {
    return this.model
  }
  /*
    Method called by view to grab state
  */
  getState (path) {
    return this.model.get(ensurePath(path))
  }
  /*
    Checks if payload is serializable
  */
  isSerializablePayload (payload) {
    if (!isSerializable(payload)) {
      return false
    }

    return Object.keys(payload).reduce((isSerializablePayload, key) => {
      if (!isSerializable(payload[key])) {
        return false
      }

      return isSerializablePayload
    }, true)
  }
  /*
    Uses function tree to run the array and optional
    payload passed in. The payload will be checkd
  */
  runSignal (name, signal, payload = {}) {
    if (this.devtools && this.devtools.enforceSerializable && !this.isSerializablePayload(payload)) {
      throwError(`You passed an invalid payload to signal "${name}". Only serializable payloads can be passed to a signal`)
    }
    this.runTree(name, signal, payload || {})
  }
  /*
    Returns a function which binds the name/path of signal,
    and the array. This allows view layer to just call it with
    an optional payload and it will run
  */
  getSignal (path) {
    const pathArray = ensurePath(path)
    const signalKey = pathArray.pop()
    const module = pathArray.reduce((currentModule, key) => {
      return currentModule ? currentModule.modules[key] : undefined
    }, this.module)
    const signal = module && module.signals[signalKey]

    if (!signal) {
      throwError(`There is no signal at path "${path}"`)
    }

    return this.runSignal.bind(this, path, signal)
  } 

  getSignals() {
    return this.signalsClass.getSignals()
  }
}

class Signals {
  constructor(controller) {
    this.controller = controller;
  }
  getSignals() {
    if (!this.signals)
      this.signals = this.getModuleSignals('', this.controller.module)
    return this.signals
  }   
  extractSignal(path, signals) {
    return Object.keys(signals).reduce((sigs, key) => {
      sigs[key] = this.controller.runSignal.bind(this.controller, `${path}.${key}`, signals[key])
      return sigs
    }, {});
  }
  getModuleSignals(path, module) {
    const data = {}
    if (module.signals) {
      Object.assign(data, this.extractSignal(path, module.signals))
    }
    for (const subModule in module.modules) {
      const newPath = path === '' ? subModule : `${path}.${subModule}`
      const signals = this.getModuleSignals(newPath, module.modules[subModule])
      if (signals) {
        data[subModule] = Object.assign(data[subModule] || {}, signals)
      }
    }
    return data
  }
}

export default function (...args) {
  return new Controller(...args)
}
