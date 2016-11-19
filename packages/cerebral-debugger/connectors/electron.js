import {ipcRenderer} from 'electron'

let onChangeCallback
let hasInitialized = false
let backlog = []

const connector = {
  onEvent (cb) {
    onChangeCallback = cb
    if (backlog.length) {
      backlog.forEach((message) => {
        onChangeCallback(message)
      })
      backlog = []
    }
  },
  sendEvent (eventName, payload = null) {
    ipcRenderer.send('message', {
      type: eventName,
      data: payload
    })
  },
  connect (initCallback) {
    ipcRenderer.on('message', (event, message) => {
      if (message.type === 'ping') {
        connector.sendEvent('pong')
        return
      }

      if (hasInitialized && !onChangeCallback) {
        backlog.push(message)
      } else if (hasInitialized) {
        onChangeCallback(message)
      } else if (message.type === 'init') {
        hasInitialized = true
        backlog.push(message)
        initCallback(message.version || 'v1')
      }
    })

    connector.sendEvent('ping')
  }
}

export default connector
