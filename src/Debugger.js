class Debugger {
  constructor() {
    this.APP_ID = String(Date.now())
    this.VERSION = 'v1'
    this.backlog = []
    this.isConnected = false
  }
  init(initialModel) {
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

export default Debugger
