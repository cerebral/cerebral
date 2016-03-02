import offlineJs from 'offline-js'
offlineJs

const offline = window.Offline

export function onOfflineChange (callbackSignal) {
  offline.on('confirmed-up', (event) => {
    callbackSignal({offline: false})
  })
  offline.on('confirmed-down', (event) => {
    callbackSignal({offline: true})
  })
}

export default {
  offline
}
