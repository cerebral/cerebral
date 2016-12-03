/* global CustomEvent */
import WebSocket from 'ws'
const VERSION = 'v1'

class Devtools {
  constructor (options = {
    remoteDebugger: null
  }) {
    this.VERSION = VERSION
    this.remoteDebugger = options.remoteDebugger || null
    this.backlog = []
    this.latestExecutionId = null
    this.isConnected = false
    this.ws = null
    this.isResettingDebugger = false

    this.sendInitial = this.sendInitial.bind(this)

    this.init()
  }

  addListeners () {
    if (this.remoteDebugger) {
      this.ws = new WebSocket(`ws://${this.remoteDebugger}`)
      this.ws.onmessage = (event) => {
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
    } else {
      window.addEventListener('funtion-tree.debugger.pong', this.sendInitial)
      window.addEventListener('funtion-tree.debugger.ping', this.sendInitial)
    }
  }
  init () {
    this.addListeners()

    if (this.remoteDebugger) {
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({type: 'ping'}))
      }
      this.ws.onclose = () => {
        console.warn('You have configured remoteDebugger, but could not connect. Falling back to Chrome extension')
        this.reInit()
      }
      this.ws.onerror = () => this.reInit()
    } else {
      const event = new CustomEvent('function-tree.client.message', {
        detail: JSON.stringify({type: 'ping'})
      })
      window.dispatchEvent(event)
    }
  }
  safeStringify (object) {
    const refs = []

    return JSON.stringify(object, (key, value) => {
      const isObject = (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      )

      if (isObject && refs.indexOf(value) > -1) {
        return '[CIRCULAR]'
      } else if (isObject) {
        refs.push(value)
      }

      return value
    })
  }
  reInit () {
    this.remoteDebugger = null
    this.addListeners()

    const event = new CustomEvent('function-tree.client.message', {
      detail: JSON.stringify({type: 'ping'})
    })
    window.dispatchEvent(event)
  }
  sendMessage (stringifiedMessage) {
    if (this.remoteDebugger) {
      this.ws.send(stringifiedMessage)
    } else {
      const event = new CustomEvent('function-tree.client.message', {detail: stringifiedMessage})
      window.dispatchEvent(event)
    }
  }
  watchExecution (tree) {
    tree.on('start', (execution) => {
      const message = JSON.stringify({
        type: 'executionStart',
        data: {
          execution: {
            executionId: execution.id,
            name: execution.name,
            staticTree: execution.staticTree,
            datetime: execution.datetime
          }
        }
      })

      if (this.isConnected) {
        this.sendMessage(message)
      } else {
        this.backlog.push(message)
      }
    })
    tree.on('end', (execution) => {
      const message = JSON.stringify({
        type: 'executionEnd',
        data: {
          execution: {
            executionId: execution.id
          }
        }
      })
      this.latestExecutionId = execution.id

      if (this.isConnected) {
        this.sendMessage(message)
      } else {
        this.backlog.push(message)
      }
    })
    tree.on('pathStart', (path, execution, funcDetails) => {
      const message = JSON.stringify({
        type: 'executionPathStart',
        data: {
          execution: {
            executionId: execution.id,
            functionIndex: funcDetails.functionIndex,
            path
          }
        }
      })

      if (this.isConnected) {
        this.sendMessage(message)
      } else {
        this.backlog.push(message)
      }
    })
    tree.on('functionStart', (execution, funcDetails, payload) => {
      const message = this.safeStringify({
        type: 'execution',
        data: {
          execution: {
            executionId: execution.id,
            functionIndex: funcDetails.functionIndex,
            payload,
            data: null
          }
        }
      })

      if (this.isConnected) {
        this.sendMessage(message)
      } else {
        this.backlog.push(message)
      }
    })
  }
  sendInitial () {
    const message = JSON.stringify({
      type: 'init',
      version: this.VERSION
    })

    this.sendMessage(message)
    this.backlog.forEach((backlogItem) => {
      this.sendMessage(backlogItem)
    })

    this.backlog = []
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
      version: this.VERSION,
      data: data
    })
  }
  sendExecutionData (debuggingData, context, functionDetails, payload) {
    const message = this.createExecutionMessage(debuggingData, context, functionDetails, payload)

    if (this.isConnected) {
      this.sendMessage(message)
    } else {
      this.backlog.push(message)
    }
  }
  Provider (options = {colors: {}}) {
    const sendExecutionData = this.sendExecutionData.bind(this)
    function provider (context, functionDetails, payload) {
      context.debugger = {
        send (data) {
          sendExecutionData(data, context, functionDetails, payload)
        },
        getColor (key) {
          return options.colors[key] || '#333'
        }
      }

      return context
    }

    return provider
  }
}

export default function (...args) {
  return new Devtools(...args)
}
