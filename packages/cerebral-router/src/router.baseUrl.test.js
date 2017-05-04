/* eslint-env mocha */
/* eslint-disable no-console */
const {makeTest, triggerUrlChange} = require('./testHelper')

// Have to require due to mocks (load correct order)
const Router = require('../src').default
const addressbar = require('addressbar')
const assert = require('assert')

describe('baseUrl', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })

  it('root route', () => {
    let count = 0
    const controller = makeTest(
      Router({
        baseUrl: '/base',
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/base')
    triggerUrlChange('/base?query=')
    triggerUrlChange('/base#hash')
    triggerUrlChange('/base?query=#hash')
    assert.equal(count, 4)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/base/path')
    triggerUrlChange('/base/path?query=')
    triggerUrlChange('/base/path/#/')
    assert.equal(console.warn.warnings.length, 3)
  })

  it('should allow setting root as baseUrl', () => {
    let count = 0
    makeTest(
      Router({
        baseUrl: '/',
        routes: {
          '/': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    assert.equal(count, 1)
  })
})
