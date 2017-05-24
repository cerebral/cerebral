/* eslint-env mocha */
import {Controller} from '../'
import assert from 'assert'
import {splice} from './'
import {props, state} from '../tags'

describe('operator.splice', () => {
  it('should splice value in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b', 'c', 'd']
      },
      signals: {
        test: [
          splice(state`list`, 1, 2, 'x', 'y')
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['a', 'x', 'y', 'd']})
  })
  it('should splice value from props in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b', 'c', 'd']
      },
      signals: {
        test: [
          splice(state`list`, props`idx`, 1, props`x`, props`y`)
        ]
      }
    })
    controller.getSignal('test')({idx: 2, x: 'one', y: 'two'})
    assert.deepEqual(controller.getState(), {list: ['a', 'b', 'one', 'two', 'd']})
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          splice(props`list`, 1, 1, 'bar')
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
