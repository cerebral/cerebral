import EventEmitter from 'events'
import executeTree from './executeTree'
import createStaticTree from './staticTree'
import ExecutionProvider from './providers/Execution'
import InputProvider from './providers/Input'
import PathProvider from './providers/Path'
import Path from './Path'
import Abort from './Abort'

/*
  Need to create a unique ID for each execution to identify it
  in debugger
*/
function createUniqueId () {
  return Date.now() + '_' + Math.floor(Math.random() * 10000)
}

/*
  Validate any returned value from a function. Has
  to be nothing or an object
*/
function isValidResult (result) {
  return (
    !result ||
    (
      result &&
      !Array.isArray(result) &&
      typeof result === 'object'
    )
  )
}

/*
  If it walks like a duck and quacks like a duck...
*/
function isPromise (result) {
  return result && result.then && result.catch && typeof result.then === 'function' && typeof result.catch === 'function'
}

class FunctionTreeExecution extends EventEmitter {
  constructor (name, staticTree, functionTree, errorCallback) {
    super()
    this.id = createUniqueId()
    this.name = name
    this.staticTree = staticTree
    this.functionTree = functionTree
    this.datetime = Date.now()
    this.errorCallback = errorCallback

    this.runFunction = this.runFunction.bind(this)
  }
  /*
    Creates the context for the current function to be run,
    emits events and handles its returned value. Also handles
    the returned value being a promise
  */
  runFunction (funcDetails, payload, next) {
    const context = this.createContext(funcDetails, payload)
    const functionTree = this.functionTree
    const errorCallback = this.errorCallback
    const execution = this

    functionTree.emit('functionStart', execution, funcDetails, payload)
    const result = funcDetails.function(context)

    if (result instanceof Abort) {
      return functionTree.emit('abort', execution, funcDetails, payload)
    }

    /*
      If result is a promise we want to emit an event and wait for it to resolve to
      move on
    */
    if (isPromise(result)) {
      functionTree.emit('asyncFunction', execution, funcDetails, payload)
      result
        .then(function (result) {
          if (result instanceof Path) {
            functionTree.emit('functionEnd', execution, funcDetails, payload)
            next(result.toJS())
          } else if (funcDetails.outputs) {
            functionTree.emit('functionEnd', execution, funcDetails, payload)
            throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path')
          } else if (isValidResult(result)) {
            functionTree.emit('functionEnd', execution, funcDetails, payload)
            next({
              payload: result
            })
          } else {
            functionTree.emit('functionEnd', execution, funcDetails, payload)
            throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result')
          }
        })
        .catch(function (result) {
          if (result instanceof Error) {
            errorCallback(result)
          } else if (result instanceof Path) {
            functionTree.emit('functionEnd', execution, funcDetails, payload)
            next(result.toJS())
          } else if (funcDetails.outputs) {
            let error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path')

            errorCallback(error)
          } else if (isValidResult(result)) {
            functionTree.emit('functionEnd', execution, funcDetails, payload)
            next({
              payload: result
            })
          } else {
            let error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result')

            errorCallback(error)
          }
        })
    } else if (result instanceof Path) {
      functionTree.emit('functionEnd', execution, funcDetails, payload)
      next(result.toJS())
    } else if (funcDetails.outputs) {
      let error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path')

      errorCallback(error)
    } else if (isValidResult(result)) {
      functionTree.emit('functionEnd', execution, funcDetails, payload)
      next({
        payload: result
      })
    } else {
      let error = new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result')
      errorCallback(error)
    }
  }
  /*
    Creates the context for the next running function
  */
  createContext (funcDetails, payload) {
    return [
      ExecutionProvider(this, Abort),
      InputProvider(),
      PathProvider()
    ].concat(this.functionTree.contextProviders).reduce(function (currentContext, contextProvider) {
      var newContext = (
        typeof contextProvider === 'function'
          ? contextProvider(currentContext, funcDetails, payload)
          : Object.assign(currentContext, contextProvider)
      )

      if (newContext !== currentContext) {
        throw new Error('function-tree: You are not returning the context from a provider')
      }

      return newContext
    }, {})
  }
}

class FunctionTree extends EventEmitter {
  constructor (contextProviders) {
    super()
    this.cachedTrees = []
    this.cachedStaticTrees = []
    this.contextProviders = contextProviders || []
    this.runTree = this.runTree.bind(this)
    this.runTree.on = this.on.bind(this)
    this.runTree.once = this.once.bind(this)
    this.runTree.off = this.removeListener.bind(this)

    return this.runTree
  }
  /*
    Analyses the tree to identify paths and its validity. This analysis
    is cached. Then the method creates an execution for the tree to run.
  */
  runTree () {
    let name
    let tree
    let payload
    let cb
    let staticTree
    const args = [].slice.call(arguments)
    args.forEach(function (arg) {
      if (typeof arg === 'string') {
        name = arg
        return
      } else if (Array.isArray(arg)) {
        tree = arg
      } else if (typeof arg === 'function') {
        cb = arg
      } else {
        payload = arg
      }
    })

    if (!tree) {
      throw new Error('function-tree - You did not pass in a function tree')
    }

    if (this.cachedTrees.indexOf(tree) === -1) {
      staticTree = createStaticTree(tree)
      this.cachedTrees.push(tree)
      this.cachedStaticTrees.push(staticTree)
    } else {
      staticTree = this.cachedStaticTrees[this.cachedTrees.indexOf(tree)]
    }
    const execution = new FunctionTreeExecution(name, staticTree, this, (error) => {
      cb && cb(error, execution, payload)
      setTimeout(() => {
        this.emit('error', error, execution, payload)
      })
    })

    this.emit('start', execution, payload)
    executeTree(execution.staticTree, execution.runFunction, payload, () => {
      this.emit('end', execution, payload)
      cb && cb(null, execution, payload)
    })
  }
}

export default (contextProviders) => {
  return new FunctionTree(contextProviders)
}
