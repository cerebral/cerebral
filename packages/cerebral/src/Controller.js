import DependencyStore from './DependencyStore'
import {FunctionTree} from 'function-tree'
import Module from './Module'
import Model from './Model'
import {ensurePath, isDeveloping, throwError, isSerializable, verifyStrictRender, forceSerializable, isObject, getProviders, cleanPath} from './utils'
import VerifyInputProvider from './providers/VerifyInput'
import StateProvider from './providers/State'
import DebuggerProvider from './providers/Debugger'
import ControllerProvider from './providers/Controller'
import ResolveProvider from './providers/Resolve'

/*
  The controller is where everything is attached. The devtools
  and router is attached directly. Also a top level module is created.
  The controller creates the function tree that will run all signals,
  based on top level providers and providers defined in modules
*/
class Controller extends FunctionTree {
  constructor ({state = {}, signals = {}, providers = [], modules = {}, router, devtools = null, options = {}}) {
    super()
    this.componentDependencyStore = new DependencyStore()
    this.options = options
    this.flush = this.flush.bind(this)
    this.devtools = devtools
    this.model = new Model({}, this.devtools)
    this.module = new Module(this, [], {
      state,
      signals,
      modules
    })
    this.router = router ? router(this) : null

    if (options.strictRender) {
      console.warn('DEPRECATION - No need to use strictRender option anymore, it is the only render mode now')
    }

    this.contextProviders = [
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
      StateProvider(),
      ResolveProvider()
    ).concat(
      providers.concat(getProviders(this.module))
    )

    this.on('asyncFunction', (execution, funcDetails) => {
      if (!funcDetails.isParallel) {
        this.flush()
      }
    })
    this.on('parallelStart', () => this.flush())
    this.on('parallelProgress', (execution, currentPayload, functionsResolving) => {
      if (functionsResolving === 1) {
        this.flush()
      }
    })
    this.on('end', () => this.flush())
    this.on('error', (error) => {
      throw error
    })

    if (this.devtools) {
      this.devtools.init(this)
    } else {
      this.on('error', (error) => {
        throw error
      })
    }

    if (
      this.devtools &&
      isDeveloping() &&
      typeof navigator !== 'undefined' &&
      /Chrome/.test(navigator.userAgent)
    ) {
      console.warn('You are not using the Cerebral devtools. It is highly recommended to use it in combination with the debugger: https://cerebral.github.io/cerebral-website/install/02_debugger.html')
    }

    if (this.router) this.router.init()

    this.model.flush()
    this.emit('initialized')
  }
  /*
    Whenever components needs to be updated, this method
    can be called
  */
  flush (force) {
    const changes = this.model.flush()

    if (!force && !Object.keys(changes).length) {
      return
    }

    this.updateComponents(changes, force)
    this.emit('flush', changes, Boolean(force))
  }
  updateComponents (changes, force) {
    let componentsToRender = []

    if (force) {
      componentsToRender = this.componentDependencyStore.getAllUniqueEntities()
    } else {
      componentsToRender = this.componentDependencyStore.getUniqueEntities(changes)
      if (this.devtools && this.devtools.verifyStrictRender) {
        verifyStrictRender(changes, this.componentDependencyStore.map)
      }
    }

    const start = Date.now()
    componentsToRender.forEach((component) => {
      if (this.devtools) {
        this.devtools.updateComponentsMap(component)
      }
      component._updateFromState(changes)
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
    return this.model.get(ensurePath(cleanPath(path)))
  }
  /*
    Uses function tree to run the array and optional
    payload passed in. The payload will be checkd
  */
  runSignal (name, signal, payload = {}) {
    if (this.devtools && (!isObject(payload) || !isSerializable(payload))) {
      console.warn(`You passed an invalid payload to signal "${name}". Only serializable payloads can be passed to a signal. The payload has been ignored. This is the object:`, payload)
      payload = {}
    }

    if (this.devtools) {
      payload = Object.keys(payload).reduce((currentPayload, key) => {
        if (!isSerializable(payload, this.devtools.allowedTypes)) {
          console.warn(`You passed an invalid payload to signal "${name}", on key "${key}". Only serializable values like Object, Array, String, Number and Boolean can be passed in. Also these special value types:`, this.devtools.allowedTypes)

          return currentPayload
        }

        currentPayload[key] = forceSerializable(payload[key])

        return currentPayload
      }, {})
    }

    this.runTree(name, signal, payload)
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

    return signal
  }
}

export default function (...args) {
  return new Controller(...args)
}
