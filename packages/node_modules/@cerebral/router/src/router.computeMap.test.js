/* eslint-env mocha */
/* eslint-disable no-console */
import { Compute } from 'cerebral'
import { props, state } from 'cerebral/tags'
import { makeTest, triggerUrlChange } from '../test/helper'
import Router from './'
import addressbar from 'addressbar'
import * as assert from 'assert'

describe('Compute in map', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })

  it('should use computed to update url prop on state changes', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/:page',
            map: {
              page: Compute(
                state`group`,
                state`project`,
                (group, project) => group + '-' + project
              ),
            },
          },
        ],
      }),
      {
        test: [
          ({ state }) => {
            state.set('group', 'cerebral')
            state.set('project', 'router')
          },
        ],
        noop: [],
      }
    )

    triggerUrlChange('/foo-bar') // make route active
    controller.getSignal('test')() // trigger state changes
    assert.equal(addressbar.value, 'http://localhost:3000/cerebral-router')
  })
})

describe('Compute in rmap', () => {
  beforeEach(() => {
    console.warn.warnings = []
    addressbar.value = '/'
    addressbar.removeAllListeners('change')
  })

  it('should use computed to update state on url changes', () => {
    const controller = makeTest(
      Router({
        preventAutostart: true,
        routes: [
          {
            path: '/:page',
            rmap: {
              project: Compute(
                props`page`,
                (page) => (page ? page.split('-')[1] : null)
              ),
            },
          },
        ],
      })
    )

    triggerUrlChange('/foo-bar')
    assert.equal(controller.getState('project'), 'bar')
  })
})
