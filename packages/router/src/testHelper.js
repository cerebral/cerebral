// MOCKING
/* eslint-env mocha */
/* eslint-disable no-console */
import {Controller} from 'cerebral'
import addressbar from 'addressbar'

const devtools = {
  init () {},
  send () {},
  sendExecutionData () {}
}

function makeTest (router, signals) {
  return Controller({
    devtools,
    modules: {
      router
    },
    signals
  })
}

module.exports = {
  makeTest,
  triggerUrlChange (url) {
    let defaultPrevented = false

    addressbar.emit('change', {
      preventDefault () {
        defaultPrevented = true
      },
      target: {value: addressbar.origin + url}
    })
    if (!defaultPrevented) addressbar.value = url
  }
}
