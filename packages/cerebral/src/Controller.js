import DependencyStore from './DependencyStore'
import FunctionTree from 'function-tree'
import Module from './Module'
import Model from './Model'
import {ensurePath, isDeveloping, throwError, isSerializable, verifyStrictRender} from './utils'
import VerifyInputProvider from './providers/VerifyInput'
import StateProvider from './providers/State'
import DebuggerProvider from './providers/Debugger'
import ControllerProvider from './providers/Controller'
import EventEmitter from 'eventemitter3'
import {dependencyStore as computedDependencyStore} from './Computed'

/*
  The controller is where everything is attached. The devtools
  and router is attached directly. Also a top level module is created.
  The controller creates the function tree that will run all signals,
  based on top level providers and providers defined in modules
*/
class Controller extends EventEmitter {
  constructor ({state = {}, signals = {}, providers = [], modules = {}, router, devtools = null, options = {}}) {
    super()
    this.computedDependencyStore = computedDependencyStore
    this.componentDependencyStore = new DependencyStore()
    this.options = options
    this.flush = this.flush.bind(this)
    this.devtools = devtools
    this.model = new Model({}, this.devtools)
    this.module = new Module([], {
      state,
      signals,
      modules
    }, this)
    this.router = router ? router(this) : null

    const allProviders = [
      ControllerProvider(this)
    ].concat(
      this.router ? [
        this.router.provider
      ] : []
    ).concat((
      this.devtools ? [
        DebuggerProvider()
      ] : []
    )).concat((
      isDeveloping() ? [
        VerifyInputProvider
      ] : []
    )).concat(
      StateProvider()
    ).concat(
      providers.concat(this.module.getProviders())
    )

    this.runTree = new FunctionTree(allProviders)
    this.runTree.on('asyncFunction', () => this.flush())
    this.runTree.on('pathEnd', () => this.flush())
    this.runTree.on('end', () => this.flush())

    if (this.devtools) {
      this.devtools.init(this)
    } else if (
      process.env.NODE_ENV !== 'production' &&
      typeof navigator !== 'undefined' &&
      /Chrome/.test(navigator.userAgent)
    ) {
      console.warn('You are not using the Cerebral devtools. It is highly recommended to use it in combination with the debugger: https://cerebral.github.io/cerebral-website/getting-real/03_devtools.html')
    }

    if (this.router) this.router.init()

    this.emit('initialized')
  }
  /*
    Whenever computeds and components needs to be updated, this method
    can be called
  */
  flush (force) {
    const changes = this.model.flush()

    this.updateComputeds(changes, force)
    this.updateComponents(changes, force)
    this.emit('flush', changes, Boolean(force))
  }
  updateComputeds (changes, force) {
    let computedsAboutToBecomeDirty

    if (force) {
      computedsAboutToBecomeDirty = this.computedDependencyStore.getAllUniqueEntities()
    } else if (this.options.strictRender) {
      computedsAboutToBecomeDirty = this.computedDependencyStore.getStrictUniqueEntities(changes)
    } else {
      computedsAboutToBecomeDirty = this.computedDependencyStore.getUniqueEntities(changes)
    }

    computedsAboutToBecomeDirty.forEach((computed) => {
      computed.flag()
    })
  }
  /*
    On "flush" use changes to extract affected components
    from dependency store and render them
  */
  updateComponents (changes, force) {
    let componentsToRender = []

    if (force) {
      componentsToRender = this.componentDependencyStore.getAllUniqueEntities()
    } else if (this.options.strictRender) {
      componentsToRender = this.componentDependencyStore.getStrictUniqueEntities(changes)
      if (this.devtools && this.devtools.verifyStrictRender) {
        verifyStrictRender(changes, this.componentDependencyStore.map)
      }
    } else {
      componentsToRender = this.componentDependencyStore.getUniqueEntities(changes)
    }

    const start = Date.now()
    componentsToRender.forEach((component) => {
      if (this.devtools) {
        this.devtools.updateComponentsMap(component)
      }
      component._update(force)
    })
    const end = Date.now()

    if (this.devtools && componentsToRender.length) {
      this.devtools.sendComponentsMap(componentsToRender, changes, start, end)
    }
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

    this.runTree(name, signal, payload || {}, (error) => {
      if (error) {
        throw error
      }
    })
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

    return function (payload) {
      this.runSignal(path, signal, payload)
    }.bind(this)
  }
}

export default function (...args) {
  return new Controller(...args)
}
