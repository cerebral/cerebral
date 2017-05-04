/* eslint-env mocha */
/* eslint-disable no-console */
const {makeTest, triggerUrlChange} = require('./testHelper')
const state = require('../../cerebral/src/tags').state

// Have to require due to mocks (load correct order)
const Router = require('../src').default
const addressbar = require('addressbar')
const assert = require('assert')

describe('stateMapping', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })

  it('should update url when mapped to state changes', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [{
          path: '/:page',
          map: {page: state`page`}
        }]
      }), {
        test: [({state}) => {
          state.set('page', 'bar')
        }]
      }
    )

    triggerUrlChange('/foo')
    controller.getSignal('test')()
    assert.equal(addressbar.value, 'http://localhost:3000/bar')
  })
})
