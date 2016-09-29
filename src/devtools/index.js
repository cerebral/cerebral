const PLACEHOLDER_INITIAL_MODEL = 'PLACEHOLDER_INITIAL_MODEL'
const PLACEHOLDER_DEBUGGING_DATA = '$$DEBUGGING_DATA$$'
const VERSION = 'v1'
/*
  Connects to the Cerebral debugger
  - Triggers events with information from function tree execution
  - Stores data related to time travel, if activated
*/
class Devtools {
  constructor(options = {storeMutations: true, preventExternalMutations: true}) {
    this.VERSION = VERSION
    this.storeMutations = options.storeMutations
    this.preventExternalMutations = options.preventExternalMutations
    this.backlog = []
    this.mutations = []
    this.latestExecutionId = null
    this.executionCount = 0
    this.initialModelString = null
    this.isConnected = false
    this.controller = null
    this.originalRunTreeFunction = null

    this.sendInitial = this.sendInitial.bind(this)
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
  remember(executionId) {
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

    this.controller.emit('flush', {}, true)
  }
  /*

  */
  reset() {
    this.controller.model.state = JSON.parse(this.initialModelString)
    this.backlog = []
    this.mutations = []
    this.controller.emit('flush', {}, true)
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
  init(controller) {
    this.controller = controller
    this.originalRunTreeFunction = controller.runTree

    if (this.storeMutations) {
      this.initialModelString = JSON.stringify(controller.model.get())
    }

    window.addEventListener('cerebral2.debugger.changeModel', (event) => {
      controller.model.set(event.detail.path, event.detail.value)
      controller.flush()
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

    const event = new window.CustomEvent('cerebral2.client.message', {
      detail: JSON.stringify({type: 'ping'})
    })
    window.dispatchEvent(event)

    this.watchExecution()
  }
  /*
    Watches function tree for execution of signals. This is passed to
    debugger to prevent time travelling when executing. It also tracks
    latest executed signal for "remember" to know when signals can be
    called again
  */
  watchExecution() {
    this.controller.runTree.on('start', () => {
      if (this.executionCount === 0) {
        const event = new window.CustomEvent('cerebral2.client.message', {
          detail: JSON.stringify({type: 'executionChange', data: {isExecuting: true}})
        })
        window.dispatchEvent(event)
      }
      this.executionCount++
    })
    this.controller.runTree.on('end', (execution) => {
      this.latestExecutionId = execution.id
      this.executionCount--
      if (this.executionCount === 0) {
        const event = new window.CustomEvent('cerebral2.client.message', {
          detail: JSON.stringify({type: 'executionChange', data: {isExecuting: false}})
        })
        window.dispatchEvent(event)
      }
    })
  }
  /*
    Send initial model. If model has already been stringified we reuse it. Any
    backlogged executions will also be triggered
  */
  sendInitial() {
    const initialModel = this.controller.model.get()

    this.isConnected = true
    const initEvent = new window.CustomEvent('cerebral2.client.message', {
      detail: JSON.stringify({
        type: 'init',
        version: this.VERSION,
        data: {
          initialModel: this.initialModelString ? PLACEHOLDER_INITIAL_MODEL : initialModel,
          executions: []
        }
      }).replace(`"${PLACEHOLDER_INITIAL_MODEL}"`, this.initialModelString)
    })
    window.dispatchEvent(initEvent)

    this.backlog.forEach((detail) => {
      const event = new window.CustomEvent('cerebral2.client.message', {
        detail
      })
      window.dispatchEvent(event)
    })
    this.backlog = []
  }
  /*
    Create the stringified event detail for the debugger. As we need to
    store mutations with the default true "storeMutations" option used
    by time travel and jumping between Cerebral apps, we are careful
    not doing unnecessary stringifying.
  */
  createEventDetail(debuggingData, context, functionDetails, payload) {
    const type = 'execution'
    let mutationString = '';

    if (this.storeMutations && debuggingData && debuggingData.type === 'mutation') {
      mutationString = JSON.stringify(debuggingData)
    }

    const data = {
      executions: [{
        name: context.execution.name,
        executionId: context.execution.id,
        functionIndex: functionDetails.functionIndex,
        staticTree: functionDetails.functionIndex === 0 && !debuggingData ? context.execution.staticTree : null,
        payload: payload,
        datetime: context.execution.datetime,
        data: mutationString ? PLACEHOLDER_DEBUGGING_DATA : debuggingData
      }]
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
  send(debuggingData = null, context, functionDetails, payload) {
    const detail = this.createEventDetail(debuggingData, context, functionDetails, payload)

    if (this.isConnected) {
      const event = new window.CustomEvent('cerebral2.client.message', {
        detail
      })
      window.dispatchEvent(event)
    } else {
      this.backlog.push(detail)
    }
  }
}

export default function(...args) {
  return new Devtools(...args)
}
