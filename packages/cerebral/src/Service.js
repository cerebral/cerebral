import {FunctionTree} from 'function-tree'
import ServiceModule from './ServiceModule'
import {ensurePath, isDeveloping, throwError, isSerializable, forceSerializable, isObject, getProviders} from './utils'
import VerifyPropsProvider from './providers/VerifyProps'
import DebuggerProvider from './providers/Debugger'
import ControllerProvider from './providers/Controller'
import PropsProvider from './providers/Props'

class Service extends FunctionTree {
  constructor ({signals = {}, providers = [], modules = {}, devtools = null, options = {}}) {
    super()
    this.options = options
    this.devtools = devtools
    this.module = new ServiceModule(this, [], {
      signals,
      modules
    })

    this.contextProviders = [
      PropsProvider(),
      ControllerProvider(this)
    ].concat((
      this.devtools ? [
        DebuggerProvider()
      ] : []
    )).concat((
      isDeveloping() ? [
        VerifyPropsProvider
      ] : []
    )).concat(
      providers.concat(getProviders(this.module))
    )

    if (this.devtools) {
      this.devtools.init(this)
      this.on('error', function throwErrorCallback (error) {
        if (Array.isArray(this._events.error) && this._events.error.length > 2) {
          this.removeListener('error', throwErrorCallback)
        } else {
          throw error
        }
      })
    } else {
      this.on('error', function throwErrorCallback (error) {
        if (Array.isArray(this._events.error) && this._events.error.length > 1) {
          this.removeListener('error', throwErrorCallback)
        } else {
          throw error
        }
      })
    }

    this.emit('initialized')
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
  return new Service(...args)
}
