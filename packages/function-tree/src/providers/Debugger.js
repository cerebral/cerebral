/* global CustomEvent */
function safeStringify (obj) {
  let cache = []
  const returnValue = JSON.stringify(obj || {}, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) === -1) {
        cache.push(value)

        return value
      }
      return '[CIRCULAR]'
    }
    return value
  })

  cache = null

  return returnValue
}

export default function DebuggerProvider (options = {}) {
  if (typeof window === 'undefined' ||
      (
        typeof window.chrome === 'undefined' &&
        !process && !process.versions && !process.versions.electron
      )
    ) {
    throw new Error('The debugger does not work in this environment, load up the Node debugger instead')
  }

  let isConnected = false
  const APP_ID = String(Date.now())
  const VERSION = 'v1'
  const backlog = []

  function send (debuggingData, context, functionDetails, payload) {
    const type = 'execution'
    const data = {
      name: context.execution.name,
      executionId: context.execution.id,
      functionIndex: functionDetails.functionIndex,
      staticTree: context.execution.staticTree,
      payload: payload,
      datetime: context.execution.datetime,
      data: debuggingData
    }

    if (!isConnected) {
      backlog.push(data)
      return
    }
    const detail = {
      app: APP_ID,
      version: VERSION,
      type,
      data
    }

    const event = new CustomEvent('function-tree.client.message', {
      detail: safeStringify(detail)
    })
    window.dispatchEvent(event)
  }

  function sendInitial (type) {
    const event = new CustomEvent('function-tree.client.message', {
      detail: safeStringify({
        app: APP_ID,
        version: VERSION,
        type,
        data: {
          functionTrees: backlog
        }
      })
    })
    window.dispatchEvent(event)
  }

  window.addEventListener('function-tree.debugger.pong', function () {
    // When debugger already active, send new init cause new messages
    // might have been prepared while it was waiting for pong
    isConnected = true
    sendInitial('reinit')
  })
  window.addEventListener('function-tree.debugger.ping', function () {
    // When debugger activates
    isConnected = true
    sendInitial('init')
  })

  sendInitial('init')

  return (context, functionDetails, payload) => {
    context.debugger = {
      send (data) {
        send(data, context, functionDetails, payload)
      },
      getColor (key) {
        return options.colors[key] || '#333'
      }
    }

    send(null, context, functionDetails, payload)

    return context
  }
}
