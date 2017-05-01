import {ipcRenderer} from 'electron'

const addedPorts = []

const connector = {
  sendEvent (port, eventName, payload = null) {
    ipcRenderer.send('message', {
      port,
      type: eventName,
      data: payload
    })
  },
  addPort (port, eventCallback) {
    if (addedPorts.indexOf(port) >= 0) {
      return
    }

    addedPorts.push(port)
    ipcRenderer.on('port:added', function onPortAdded (event, addedPort) {
      if (addedPort === port) {
        ipcRenderer.on('message', (event, message) => {
          if (message.port !== port) {
            return
          }

          if (message.type === 'ping') {
            connector.sendEvent(port, 'pong')
            return
          }

          eventCallback(message)
        })
        connector.sendEvent(port, 'ping')
      }
    })
    ipcRenderer.on('port:exists', function onPortExists () {
      eventCallback(new Error('Something running on this port already'))
    })
    ipcRenderer.send('port:add', port)
  },
  onPortFocus (cb) {
    ipcRenderer.on('port:focus', function onPortAdded (event, port) {
      cb(port)
    })
  },
  removePort (port) {
    ipcRenderer.send('port:remove', port)
  }
}

export default connector
