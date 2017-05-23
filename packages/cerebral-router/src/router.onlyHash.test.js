/* eslint-env mocha */
/* eslint-disable no-console */
const {makeTest, triggerUrlChange} = require('./testHelper')

// Have to require due to mocks (load correct order)
const Router = require('../src').default
const addressbar = require('addressbar')
const assert = require('assert')

describe('onlyHash', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })

  it('should handle only hash urls', () => {
    let count = 0
    const controller = makeTest(
      Router({
        onlyHash: true,
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/#/')
    triggerUrlChange('/#/?query=')
    triggerUrlChange('/#/#hash')
    triggerUrlChange('/#/?query=#hash')
    triggerUrlChange('/')
    assert.equal(count, 5)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/#/foo')
    triggerUrlChange('/foo#/')
    assert.equal(console.warn.warnings.length, 1)
    assert.equal(addressbar.value, addressbar.origin + '/foo#/')
  })

  it('should work with baseUrl', () => {
    let count = 0
    const controller = makeTest(
      Router({
        onlyHash: true,
        baseUrl: '/base',
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/base#/')
    triggerUrlChange('/base#/?query=')
    triggerUrlChange('/base#/#hash')
    triggerUrlChange('/base#/?query=#hash')
    triggerUrlChange('/base')
    assert.equal(count, 5)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/base#/foo')
    triggerUrlChange('/base/foo#/')
    assert.equal(console.warn.warnings.length, 1)
    assert.equal(addressbar.value, addressbar.origin + '/base/foo#/')
  })

  it('should work with autodetected baseUrl', () => {
    addressbar.value = addressbar.origin + '/base/'
    let count = 0
    const controller = makeTest(
      Router({
        onlyHash: true,
        preventAutostart: true,
        routes: {
          '/': 'home'
        }
      }), {
        'home': [() => { count++ }]
      }
    )

    triggerUrlChange('/base/#/')
    triggerUrlChange('/base/#/?query=')
    triggerUrlChange('/base/#/#hash')
    triggerUrlChange('/base/#/?query=#hash')
    triggerUrlChange('/base/')
    assert.equal(count, 5)

    assert.doesNotThrow(() => {
      controller.getSignal('home')({
        foo: 'bar'
      })
    })

    assert.doesNotThrow(() => {
      controller.getSignal('home')()
    })

    triggerUrlChange('/base/#/foo')
    triggerUrlChange('/base/foo#/')
    assert.equal(console.warn.warnings.length, 1)
    assert.equal(addressbar.value, addressbar.origin + '/base/foo#/')
  })
})
