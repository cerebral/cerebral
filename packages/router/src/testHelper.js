// MOCKING
/* eslint-env mocha */
/* eslint-disable no-console */
const Controller = require('../../cerebral/src/Controller').default
global.window = {
  location: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000/initial'
  },
  history: {}
}
global.history = {
  pushState (_, __, value) {
    window.location.href = window.location.origin + value
    window.location.lastChangedWith = 'pushState'
  },
  replaceState (_, __, value) {
    window.location.href = window.location.origin + value
    window.location.lastChangedWith = 'replaceState'
  }
}
global.addEventListener = global.window.addEventListener = () => {}
global.window.CustomEvent = () => {}
global.window.dispatchEvent = () => {}
global.document = {}
console.warn = function (message) {
  console.warn.warnings.push(message)
}
console.warn.warnings = []

const addressbar = require('addressbar')

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
