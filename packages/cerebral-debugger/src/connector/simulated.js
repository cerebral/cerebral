import orderSignals from './orderSignals'

let initCallback
let onChangeCallback

const connector = window.CONNECTOR = {
  onChange (cb) {
    onChangeCallback = cb
    var initData = require('./mocks/' + VERSION + '/init.js')
    initData.version = VERSION
    cb(initData)
  },
  sendEvent () {},
  inspect () {},
  receiveEvent (path) {
    require.ensure([], () => {
      onChangeCallback(require('./mocks/' + path))
    })
  },
  receiveEvents (path) {
    require.ensure([], () => {
      const events = require('./mocks/' + path)
      const start = events[0].datetime
      events.forEach(function (event) {
        setTimeout(function () {
          onChangeCallback(event)
        }, event.datetime - start)
      })
    })
  },
  connect (initCallback) {
    initCallback(VERSION, () => {})
  }
}

export default connector
