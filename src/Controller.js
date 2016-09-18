import Module from './Module'
import DefaultModel from './DefaultModel'
import Debugger from './Debugger'
import {ensurePath, isDeveloping, isDebuggerEnv, throwError} from './utils'
import VerifyInputProvider from './providers/VerifyInput'
import ContextProvider from 'function-tree/providers/Context'
import ModelProvider from './providers/Model'
import DebuggerProvider from './providers/Debugger'
import ControllerProvider from './providers/Controller'
import {EventEmitter} from 'events'

class Controller extends EventEmitter {
  constructor({state = {}, signals = {}, providers = [], modules = {}, Model}) {
    super()
    this.debugger = isDebuggerEnv() ? new Debugger() : null
    this.model = Model ? new Model({}) : new DefaultModel({})
    this.module = new Module([], () => ({
      state,
      signals,
      modules,
      providers: (
        isDebuggerEnv() ? [
          DebuggerProvider(this.debugger)
        ] : []
      ).concat((
        isDeveloping() ? [
          VerifyInputProvider
        ] : []
      )).concat(
        ControllerProvider(this),
        ModelProvider(this.model)
      ).concat((providers).map(provider => typeof provider === 'function' ? provider : ContextProvider(provider)))
    }), {controller: this, providers: []})

    if (isDebuggerEnv()) {
      this.debugger.init(this.getState())
    }
  }
  getModel() {
    return this.model
  }
  getState(path) {
    return this.model.get(ensurePath(path))
  }
  getSignals(path) {
    const pathArray = ensurePath(path)
    const signalKey = pathArray.pop()
    const module = pathArray.reduce((currentModule, key) => {
      return currentModule.modules[key]
    }, this.module)
    const signal = module.signals[signalKey]

    if (!signal) {
      throwError(`There is no signal at path "${path}"`)
    }

    return module.runSignal.bind(module, path, signal)
  }
}

export default Controller
