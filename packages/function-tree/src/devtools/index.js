import DevtoolsBase from './base'
import WebSocket from 'universal-websocket-client'

export class Devtools extends DevtoolsBase {
  constructor (options) {
    super(options)
    this.trees = []
    this.latestExecutionId = null
    this.version = VERSION // eslint-disable-line
    this.init()
  }
  createSocket () {
    this.ws = new WebSocket(`ws://${this.remoteDebugger}`)
  }
  onMessage (event) {
    const message = JSON.parse(event.data)
    switch (message.type) {
      case 'pong':
        this.sendInitial()
        break
      case 'ping':
        this.sendInitial()
        break
    }
  }
  add (tree) {
    this.trees.push(tree)
    tree.contextProviders.unshift(this.Provider())
    this.watchExecution(tree, 'ft')
  }
  remove (tree) {
    this.trees.splice(this.trees.indexOf(tree), 1)
    tree.contextProviders.splice(0, 1)

    tree.removeAllListeners('start')
    tree.removeAllListeners('end')
    tree.removeAllListeners('pathStart')
    tree.removeAllListeners('functionStart')
    tree.removeAllListeners('functionEnd')
    tree.removeAllListeners('error')
  }
  removeAll () {
    const trees = this.trees.reduce((newTrees, tree) => {
      newTrees.push(tree)
      return newTrees
    }, [])
    trees.forEach((tree) => {
      this.remove(tree)
    })
  }
  sendInitial () {
    const message = JSON.stringify({
      type: 'init',
      source: 'ft',
      version: this.version
    })

    this.sendMessage(message)
    if (this.backlog.length) {
      this.sendBulkMessage(this.backlog, 'ft')
      this.backlog = []
    }
    this.isConnected = true
  }
  /*
    Create the stringified message for the debugger. As we need to
    store mutations with the default true "storeMutations" option used
    by time travel and jumping between Cerebral apps, we are careful
    not doing unnecessary stringifying.
  */
  createExecutionMessage (debuggingData, context, functionDetails, payload) {
    const type = 'execution'
    const data = {
      execution: {
        executionId: context.execution.id,
        functionIndex: functionDetails.functionIndex,
        payload: payload,
        datetime: context.execution.datetime,
        data: debuggingData
      }
    }

    return this.safeStringify({
      type: type,
      source: 'ft',
      version: this.version,
      data: data
    })
  }
  Provider () {
    const sendExecutionData = this.sendExecutionData.bind(this)
    function provider (context, functionDetails, payload) {
      context.debugger = {
        send (data) {
          sendExecutionData(data, context, functionDetails, payload)
        },
        wrapProvider (providerKey) {
          const provider = context[providerKey]

          context[providerKey] = Object.keys(provider).reduce((wrappedProvider, key) => {
            const originalFunc = provider[key]

            wrappedProvider[key] = (...args) => {
              context.debugger.send({
                method: `${providerKey}.${key}`,
                args: args
              })

              return originalFunc.apply(provider, args)
            }

            return wrappedProvider
          }, {})
        }
      }

      return context
    }

    return provider
  }
}

export default Devtools
