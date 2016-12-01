/* global CustomEvent WebSocket File FileList Blob */
import {debounce} from '../utils'
const PLACEHOLDER_INITIAL_MODEL = 'PLACEHOLDER_INITIAL_MODEL'
const PLACEHOLDER_DEBUGGING_DATA = '$$DEBUGGING_DATA$$'
const VERSION = 'v1'

/*
  Connects to the Cerebral debugger
  - Triggers events with information from function tree execution
  - Stores data related to time travel, if activated
*/
class Devtools {
  constructor (options = {
    storeMutations: true,
    preventExternalMutations: true,
    verifyStrictRender: true,
    preventInputPropReplacement: false,
    bigComponentsWarning: {
      state: 5,
      signals: 5
    },
    remoteDebugger: null,
    multipleApps: true,
    allowedTypes: []
  }) {
    this.VERSION = VERSION
    this.debuggerComponentsMap = {}
    this.debuggerComponentDetailsId = 1
    this.storeMutations = typeof options.storeMutations === 'undefined' ? true : options.storeMutations
    this.preventExternalMutations = typeof options.preventExternalMutations === 'undefined' ? true : options.preventExternalMutations
    this.verifyStrictRender = typeof options.verifyStrictRender === 'undefined' ? true : options.verifyStrictRender
    this.preventInputPropReplacement = options.preventInputPropReplacement || false
    this.bigComponentsWarning = options.bigComponentsWarning || {state: 5, signals: 5}
    this.remoteDebugger = options.remoteDebugger || null
    this.multipleApps = typeof options.multipleApps === 'undefined' ? true : options.multipleApps
    this.backlog = []
    this.mutations = []
    this.latestExecutionId = null
    this.initialModelString = null
    this.isConnected = false
    this.controller = null
    this.originalRunTreeFunction = null
    this.ws = null
    this.isResettingDebugger = false
    this.allowedTypes = [File, FileList, Blob].concat(options.allowedTypes || [])

    this.sendInitial = this.sendInitial.bind(this)
    this.sendComponentsMap = debounce(this.sendComponentsMap, 50)
  }
  /*
    To remember state Cerebral stores the initial model as stringified
    object. Since the model is mutable this is necessary. The debugger
    passes the execution id of the signal that was double clicked. This
    execution id is searched backwards in the array of mutations done.
    This is necessary as multiple mutations can be done on the same execution.
    Then all mutations are replayed to the model and all the components
    will be rerendered using the "flush" event and "force" flag.

    It will also replace the "runTree" method of the controller to
    prevent any new signals firing off when in "remember state"
  */
  remember (executionId) {
    this.controller.model.state = JSON.parse(this.initialModelString)
    let lastMutationIndex

    if (executionId === this.latestExecutionId) {
      this.controller.runTree = this.originalRunTreeFunction
      lastMutationIndex = this.mutations.length - 1
    } else {
      for (lastMutationIndex = this.mutations.length - 1; lastMutationIndex >= 0; lastMutationIndex--) {
        if (this.mutations[lastMutationIndex].executionId === executionId) {
          break
        }
      }

      this.controller.runTree = (name) => {
        console.warn(`The signal "${name}" fired while debugger is remembering state, it was ignored`)
      }
    }

    for (let x = 0; x <= lastMutationIndex; x++) {
      const mutation = JSON.parse(this.mutations[x].data)

      this.controller.model[mutation.method](...mutation.args)
    }

    this.controller.flush(true)
  }
  /*

  */
  reset () {
    this.controller.model.state = JSON.parse(this.initialModelString)
    this.backlog = []
    this.mutations = []
    this.controller.flush(true)
  }
  /*
    Sets up the listeners to Chrome Extension or remote debugger
  */
  addListeners () {
    if (this.remoteDebugger) {
      this.ws = new WebSocket(`ws://${this.remoteDebugger}`)
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        switch (message.type) {
          case 'changeModel':
            this.controller.model.set(message.data.path, message.data.value)
            this.controller.flush()
            break
          case 'remember':
            if (!this.storeMutations) {
              console.warn('Cerebral Devtools - You tried to time travel, but you have turned of storing of mutations')
            }
            this.remember(message.data)
            break
          case 'reset':
            this.reset()
            break
          case 'pong':
            this.sendInitial()
            break
          case 'ping':
            this.sendInitial()
            break
        }
      }
    } else {
      window.addEventListener('cerebral2.debugger.changeModel', (event) => {
        this.controller.model.set(event.detail.path, event.detail.value)
        this.controller.flush()
      })
      window.addEventListener('cerebral2.debugger.remember', (event) => {
        if (!this.storeMutations) {
          console.warn('Cerebral Devtools - You tried to time travel, but you have turned of storing of mutations')
        }
        this.remember(event.detail)
      })
      window.addEventListener('cerebral2.debugger.reset', (event) => {
        this.reset()
      })
      // When debugger responds a client ping
      window.addEventListener('cerebral2.debugger.pong', this.sendInitial)
      // When debugger pings the client
      window.addEventListener('cerebral2.debugger.ping', this.sendInitial)
    }
  }
  /*
    The debugger might be ready or it might not. The initial communication
    with the debugger requires a "ping" -> "pong" to identify that it
    is ready to receive messages.
    1. Debugger is open when app loads
      - Devtools sends "ping"
      - Debugger sends "pong"
      - Devtools sends "init"
    2. Debugger is opened after app load
      - Debugger sends "ping"
      - Devtools sends "init"
  */
  init (controller) {
    this.controller = controller
    this.originalRunTreeFunction = controller.runTree

    if (this.storeMutations) {
      this.initialModelString = JSON.stringify(controller.model.get())
    }

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
      const event = new CustomEvent('cerebral2.client.message', {
        detail: JSON.stringify({type: 'ping'})
      })
      window.dispatchEvent(event)
    }

    if (this.multipleApps) {
      let hidden, visibilityChange
      if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden'
        visibilityChange = 'visibilitychange'
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden'
        visibilityChange = 'msvisibilitychange'
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden'
        visibilityChange = 'webkitvisibilitychange'
      }

      document.addEventListener(visibilityChange, () => {
        if (!document[hidden]) {
          this.isResettingDebugger = true
          this.backlog.forEach((message) => {
            this.sendMessage(message)
          })
          this.isResettingDebugger = false
        }
      }, false)
    }

    this.watchExecution()
  }
  /*
    When websocket close, reinit with chrome extension
  */
  reInit () {
    this.remoteDebugger = null
    this.addListeners()

    const event = new CustomEvent('cerebral2.client.message', {
      detail: JSON.stringify({type: 'ping'})
    })
    window.dispatchEvent(event)
  }
  /*
    Sends message to chrome extension or remote debugger
  */
  sendMessage (stringifiedMessage) {
    if (this.multipleApps && !this.isResettingDebugger) {
      this.backlog.push(stringifiedMessage)
    }

    if (this.remoteDebugger) {
      this.ws.send(stringifiedMessage)
    } else {
      const event = new CustomEvent('cerebral2.client.message', {detail: stringifiedMessage})
      window.dispatchEvent(event)
    }
  }
  /*
    Watches function tree for execution of signals. This is passed to
    debugger to prevent time travelling when executing. It also tracks
    latest executed signal for "remember" to know when signals can be
    called again
  */
  watchExecution () {
    this.controller.runTree.on('start', (execution) => {
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
    this.controller.runTree.on('end', (execution) => {
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
    this.controller.runTree.on('pathStart', (path, execution, funcDetails) => {
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
    this.controller.runTree.on('functionStart', (execution, funcDetails, payload) => {
      const message = JSON.stringify({
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
  /*
    Send initial model. If model has already been stringified we reuse it. Any
    backlogged executions will also be triggered
  */
  sendInitial () {
    const initialModel = this.controller.model.get()
    const message = JSON.stringify({
      type: 'init',
      version: this.VERSION,
      data: {
        initialModel: this.initialModelString ? PLACEHOLDER_INITIAL_MODEL : initialModel
      }
    }).replace(`"${PLACEHOLDER_INITIAL_MODEL}"`, this.initialModelString)

    this.isResettingDebugger = true
    this.sendMessage(message)
    this.backlog.forEach((backlogItem) => {
      this.sendMessage(backlogItem)
    })
    this.isResettingDebugger = false

    if (!this.multipleApps) {
      this.backlog = []
    }

    this.isConnected = true

    this.sendMessage(JSON.stringify({
      type: 'components',
      data: {
        map: this.debuggerComponentsMap,
        render: {
          components: []
        }
      }
    }))
  }
  /*
    Create the stringified message for the debugger. As we need to
    store mutations with the default true "storeMutations" option used
    by time travel and jumping between Cerebral apps, we are careful
    not doing unnecessary stringifying.
  */
  createExecutionMessage (debuggingData, context, functionDetails, payload) {
    const type = 'execution'
    let mutationString = ''

    if (this.storeMutations && debuggingData && debuggingData.type === 'mutation') {
      mutationString = JSON.stringify(debuggingData)
    }

    const data = {
      execution: {
        executionId: context.execution.id,
        functionIndex: functionDetails.functionIndex,
        payload: payload,
        datetime: context.execution.datetime,
        data: mutationString ? PLACEHOLDER_DEBUGGING_DATA : debuggingData
      }
    }

    if (mutationString) {
      this.mutations.push({
        executionId: context.execution.id,
        data: mutationString
      })
    }

    return JSON.stringify({
      type: type,
      version: this.VERSION,
      data: data
    }).replace(`"${PLACEHOLDER_DEBUGGING_DATA}"`, mutationString)
  }
  /*
    Sends execution data to the debugger. Whenever a signal starts
    it will send a message to the debugger, but any functions in the
    function tree might also use this to send debugging data. Like when
    mutations are done or any wrapped methods run.
  */
  sendExecutionData (debuggingData, context, functionDetails, payload) {
    const message = this.createExecutionMessage(debuggingData, context, functionDetails, payload)

    if (this.isConnected) {
      this.sendMessage(message)
    } else {
      this.backlog.push(message)
    }
  }
  /*
    The container will listen to "flush" events from the controller
    and send an event to debugger about initial registered components
  */
  extractComponentName (component) {
    return component.constructor.displayName.replace('CerebralWrapping_', '')
  }
  /*
    Updates the map the represents what active state paths and
    components are in your app. Used by the debugger
  */
  updateComponentsMap (component, nextDeps, prevDeps) {
    const componentDetails = {
      name: this.extractComponentName(component),
      renderCount: component.renderCount ? component.renderCount + 1 : 1,
      id: component.componentDetailsId || this.debuggerComponentDetailsId++
    }
    component.componentDetailsId = componentDetails.id
    component.renderCount = componentDetails.renderCount

    if (prevDeps) {
      for (const depsKey in prevDeps) {
        const debuggerComponents = this.debuggerComponentsMap[prevDeps[depsKey]]

        for (let x = 0; x < debuggerComponents.length; x++) {
          if (debuggerComponents[x].id === component.componentDetailsId) {
            debuggerComponents.splice(x, 1)
            if (debuggerComponents.length === 0) {
              delete this.debuggerComponentsMap[prevDeps[depsKey]]
            }
            break
          }
        }
      }
    }

    if (nextDeps) {
      for (const depsKey in nextDeps) {
        this.debuggerComponentsMap[nextDeps[depsKey]] = (
          this.debuggerComponentsMap[nextDeps[depsKey]]
            ? this.debuggerComponentsMap[nextDeps[depsKey]].concat(componentDetails)
            : [componentDetails]
        )
      }
    }
  }
  /*
    Sends components map to debugger. It is debounced (check constructor).
    It needs to wait because React updates async. Instead of tracking
    callbacks we just wait 50ms as it is not that important when
    debugger updates
  */
  sendComponentsMap (componentsToRender, changes, start, end) {
    this.sendMessage(JSON.stringify({
      type: 'components',
      data: {
        map: this.debuggerComponentsMap,
        render: {
          start: start,
          duration: end - start,
          changes: changes,
          components: componentsToRender.map(this.extractComponentName)
        }
      }
    }))
  }
}

export default function (...args) {
  return new Devtools(...args)
}
