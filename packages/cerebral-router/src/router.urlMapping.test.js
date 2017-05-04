/* eslint-env mocha */
/* eslint-disable no-console */
const {makeTest, triggerUrlChange} = require('./testHelper')
const state = require('../../cerebral/src/tags').state
const props = require('../../cerebral/src/tags').props

// Have to require due to mocks (load correct order)
const Router = require('../src').default
const addressbar = require('addressbar')
const assert = require('assert')

describe('urlMapping', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })

  it('should map param to state', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [{
          path: '/:page',
          map: {page: state`page`}
        }]
      }), {
        test: []
      }
    )
    triggerUrlChange('/foo')
    assert.equal(controller.getState('page'), 'foo')
  })

  it('should map query to state', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [{
          path: '/',
          map: {modal: state`modal`}
        }]
      }), {
        test: []
      }
    )
    triggerUrlChange('/?modal=foo')
    assert.equal(controller.getState('modal'), 'foo')
  })

  it('should map param to props', () => {
    makeTest(
      Router({
        preventAutostart: true,
        routes: [{
          path: '/:page',
          signal: 'test',
          map: {page: props`page`}
        }]
      }), {
        test: [({props}) => {
          assert.equal(props.page, 'foo')
        }]
      }
    )
    triggerUrlChange('/foo')
  })

  it('should map query to props', () => {
    makeTest(
      Router({
        preventAutostart: true,
        routes: [{
          path: '/',
          signal: 'test',
          map: {modal: props`modal`}
        }]
      }), {
        test: [({props}) => {
          assert.equal(props.modal, 'foo')
        }]
      }
    )
    triggerUrlChange('/?modal=foo')
  })

  it('should ignore queries not mapped', () => {
    makeTest(
      Router({
        preventAutostart: true,
        routes: [{
          path: '/',
          signal: 'test',
          map: {modal: props`modal`}
        }]
      }), {
        test: [({props}) => {
          assert.deepEqual(props, {modal: 'foo'})
        }]
      }
    )
    triggerUrlChange('/?modal=foo&mip=mop')
  })

  it('should throw when missing signal on props mapping', () => {
    assert.throws(() => {
      makeTest(
        Router({
          preventAutostart: true,
          routes: [{
            path: '/',
            map: {modal: props`modal`}
          }]
        }), {
          test: [({props}) => {

          }]
        }
      )
    })
  })
})
