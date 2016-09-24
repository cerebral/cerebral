class Devtools {
  constructor(options = {}) {
    this.APP_ID = String(Date.now())
    this.VERSION = 'v1'
    this.timeTravel = options.timeTravel || false
    this.backlog = []
    this.mutations = []
    this.initialModelString = ''
    this.isConnected = false
    this.controller = null
  }
  remember(executionId) {
    this.controller.model.state = JSON.parse(this.initialModelString)
    let lastMutationIndex
    for (lastMutationIndex = this.mutations.length - 1; lastMutationIndex >= 0; lastMutationIndex--) {
      if (this.mutations[lastMutationIndex].executionId === executionId) {
        break
      }
    }

    for (let x = 0; x <= lastMutationIndex; x++) {
      const mutation = JSON.parse(this.mutations[x].data)

      this.controller.model[mutation.method](...mutation.args)
    }

    this.controller.emit('flush', {}, true)
  }
  init(controller) {
    const initialModel = controller.model.get()
    this.controller = controller

    if (this.timeTravel) {
      this.initialModelString = JSON.stringify(initialModel)
    }

    window.addEventListener('cerebral2.debugger.remember', (event) => {
      if (!this.timeTravel) {
        console.warn('Cerebral Devtools - You tried to time travel, but it has to be activated as an option')
      }
      this.remember(event.detail)
    })
    window.addEventListener('cerebral2.debugger.pong', () => {
      // When debugger already active, send new init cause new messages
      // might have been prepared while it was waiting for pong
      this.isConnected = true
      this.sendInitial('reinit', initialModel)
    })
    window.addEventListener('cerebral2.debugger.ping', () => {
      // When debugger activates
      this.isConnected = true
      this.sendInitial('init', initialModel)
    })

    this.sendInitial('init', initialModel)
  }
  sendInitial(type, initialModel) {
    const allExecutions = this.backlog.reduce((currentExecutions, log) => {
      return currentExecutions.concat(log.executions)
    }, [])
    const event = new window.CustomEvent('cerebral2.client.message', {
      detail: JSON.stringify({
        type: type,
        app: this.APP_ID,
        version: this.VERSION,
        data: {
          initialModel: initialModel,
          executions: allExecutions
        }
      })
    })

    window.dispatchEvent(event)
  }
  send(debuggingData, context, functionDetails, payload) {
    const type = 'execution'

    const data = {
      executions: [{
        name: context.execution.name,
        executionId: context.execution.id,
        functionIndex: functionDetails.functionIndex,
        staticTree: functionDetails.functionIndex === 0 && !debuggingData ? context.execution.staticTree : null,
        payload: payload,
        datetime: context.execution.datetime,
        data: debuggingData
      }]
    }

    if (this.timeTravel && debuggingData && debuggingData.type === 'mutation') {
      this.mutations.push({
        executionId: context.execution.id,
        data: JSON.stringify(debuggingData)
      })
    }
    if (!this.isConnected) {
      this.backlog.push(data)
      return
    }
    const detail = {
      type: type,
      app: this.APP_ID,
      version: this.VERSION,
      data: data
    }

    const event = new window.CustomEvent('cerebral2.client.message', {
      detail: JSON.stringify(detail)
    })
    window.dispatchEvent(event)
  }
}

export default function(...args) {
  return new Devtools(...args)
}
