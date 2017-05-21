/* eslint-env mocha */
import {Controller} from '../'
import assert from 'assert'
import {unshift} from './'
import {props, state} from '../tags'

describe('operator.unshift', () => {
  it('should unshift value in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b']
      },
      signals: {
        test: [
          unshift(state`list`, 'x')
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['x', 'a', 'b']})
  })
  it('should unshift value from props in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b']
      },
      signals: {
        test: [
          unshift(state`list`, props`value`)
        ]
      }
    })
    controller.getSignal('test')({value: 'x'})
    assert.deepEqual(controller.getState(), {list: ['x', 'a', 'b']})
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          unshift(props`list`, 'bar')
        ]
      }
    })

    controller.removeListener('error')
    controller.once('error', (error) => {
      assert.ok(error)
      done()
    })

    controller.getSignal('test')()
  })
})
