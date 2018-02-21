/* eslint-env mocha */
/* eslint-disable no-console */
import * as assert from 'assert'
import addressbar from 'addressbar'
import { props, state } from 'cerebral/tags'
import Router from './'
import { makeTest, triggerUrlChange } from '../test/helper'

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
        routes: [
          {
            path: '/:page',
            map: { page: state`page`, hello: state`hello` },
          },
        ],
      }),
      {
        test: [],
      }
    )
    triggerUrlChange('/foo?hello=bar')
    assert.equal(controller.getState('page'), 'foo')
    assert.equal(controller.getState('hello'), 'bar')
  })

  it('should use default state', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/:page',
            map: { page: state`page`, hello: state`hello` },
          },
        ],
      }),
      {
        test: [],
      }
    )
    triggerUrlChange('/foo')
    assert.equal(controller.getState('hello'), 'world')
  })

  it('should map query to state', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/',
            map: { modal: state`modal` },
          },
        ],
      }),
      {
        test: [],
      }
    )
    triggerUrlChange('/?modal=foo')
    assert.equal(controller.getState('modal'), 'foo')
  })

  it('should map param to props', () => {
    makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/:page',
            signal: 'test',
            map: { page: props`page` },
          },
        ],
      }),
      {
        test: [
          ({ props }) => {
            assert.equal(props.page, 'foo')
          },
        ],
      }
    )
    triggerUrlChange('/foo')
  })

  it('should map query to props', () => {
    makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/',
            signal: 'test',
            map: { modal: props`modal` },
          },
        ],
      }),
      {
        test: [
          ({ props }) => {
            assert.equal(props.modal, 'foo')
          },
        ],
      }
    )
    triggerUrlChange('/?modal=foo')
  })

  it('should ignore queries not mapped', () => {
    makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/',
            signal: 'test',
            map: { modal: props`modal` },
          },
        ],
      }),
      {
        test: [
          ({ props }) => {
            assert.deepEqual(props, { modal: 'foo' })
          },
        ],
      }
    )
    triggerUrlChange('/?modal=foo&mip=mop')
  })

  it('should throw when missing signal on props mapping', () => {
    assert.throws(() => {
      makeTest(
        Router({
          preventAutostart: true,
          routes: [
            {
              path: '/',
              map: { modal: props`modal` },
            },
          ],
        }),
        {
          test: [({ props }) => {}],
        }
      )
    })
  })
})
