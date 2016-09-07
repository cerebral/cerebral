'use strict'

const EventEmitter = require('events')
const executeTree = require('./executeTree')
const createStaticTree = require('./staticTree')
const ExecutionProvider = require('../providers/Execution')
const InputProvider = require('../providers/Input')
const PathProvider = require('../providers/Path')
const assign = require('object-assign')
const Path = require('./Path')

function createUniqueId() {
  return Date.now() + '_' + Math.random()
}

function isValidResult(result) {
  return (
    !result ||
    (
      result &&
      !Array.isArray(result) &&
      typeof result === 'object'
    )
  )
}

function FunctionTreeExecution(name, staticTree, functionTree) {
  this.id = createUniqueId()
  this.name = name
  this.staticTree = staticTree
  this.functionTree = functionTree
  this.datetime = Date.now()

  this.runFunction = this.runFunction.bind(this)
}

FunctionTreeExecution.prototype.runFunction = function(funcDetails, payload, next) {
  const context = this.createContext(funcDetails, payload)
  const functionTree = this.functionTree

  functionTree.emit('functionStart', funcDetails, payload)
  const result = funcDetails.function(context)

  if (result && result.then && result.catch && typeof result.then === 'function' && typeof result.catch === 'function') {
    result
      .then(function (result) {
        if (result instanceof Path) {
          functionTree.emit('functionEnd', funcDetails, payload)
          next(result.toJS())
        } else if (funcDetails.outputs) {
          functionTree.emit('functionEnd', funcDetails, payload)
          throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path')
        } else if (isValidResult(result)) {
          functionTree.emit('functionEnd', funcDetails, payload)
          next({
            payload: result
          })
        } else {
          functionTree.emit('functionEnd', funcDetails, payload)
          throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result')
        }
      })
      .catch(function (result) {
        if (result instanceof Error) {
          setTimeout(function () {
            functionTree.emit('functionEnd', funcDetails, payload)
            throw result
          })
        } else if (result instanceof Path) {
          functionTree.emit('functionEnd', funcDetails, payload)
          next(result.toJS())
        } else if (funcDetails.outputs) {
          functionTree.emit('functionEnd', funcDetails, payload)
          throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path')
        } else if (isValidResult(result)) {
          functionTree.emit('functionEnd', funcDetails, payload)
          next({
            payload: result
          })
        } else {
          setTimeout(function () {
            functionTree.emit('functionEnd', funcDetails, payload)
            throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result')
          })
        }
      })
  } else if (result instanceof Path) {
    functionTree.emit('functionEnd', funcDetails, payload)
    next(result.toJS())
  } else if (funcDetails.outputs) {
    functionTree.emit('functionEnd', funcDetails, payload)
    throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' needs to be a path')
  } else if (isValidResult(result)) {
    functionTree.emit('functionEnd', funcDetails, payload)
    next({
      payload: result
    })
  } else {
    functionTree.emit('functionEnd', funcDetails, payload)
    throw new Error('The result ' + JSON.stringify(result) + ' from function ' + funcDetails.name + ' is not a valid result')
  }
}

FunctionTreeExecution.prototype.createContext = function(action, payload) {
  return [
    ExecutionProvider(this),
    InputProvider(),
    PathProvider()
  ].concat(this.functionTree.contextProviders).reduce(function(currentContext, contextProvider) {
    return (
      typeof contextProvider === 'function' ?
        contextProvider(currentContext, action, payload)
      :
        assign(currentContext, contextProvider)
    )
  }, {})
}

function FunctionTree(contextProviders) {
  if (
    !Boolean(this) ||
    (typeof window !== 'undefined' && this === window)
  ) {
    return new FunctionTree(contextProviders)
  }

  this.cachedTrees = []
  this.cachedStaticTrees = []
  this.contextProviders = contextProviders || []
  this.runTree = this.runTree.bind(this)
  this.runTree.on = this.on.bind(this)
  this.runTree.once = this.once.bind(this)
  this.runTree.off = this.removeListener.bind(this)

  return this.runTree
}

FunctionTree.prototype = Object.create(EventEmitter.prototype)

FunctionTree.prototype.runTree = function() {
  var name
  var tree
  var payload
  var cb
  var staticTree
  var args = [].slice.call(arguments)
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
  var execution = new FunctionTreeExecution(name, staticTree, this)

  this.emit('start')
  executeTree(execution.staticTree, execution.runFunction, payload, function() {
    this.emit('end')
    cb && cb()
  }.bind(this))
};

module.exports = FunctionTree
