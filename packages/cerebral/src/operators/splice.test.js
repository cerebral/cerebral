/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, splice, state} from './'

describe('operator.splice', () => {
  it('should splice value in model', () => {
    const controller = new Controller({
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
  it('should splice value from input in model', () => {
    const controller = new Controller({
      state: {
        list: ['a', 'b', 'c', 'd']
      },
      signals: {
        test: [
          splice(state`list`, input`idx`, 1, input`x`, input`y`)
        ]
      }
    })
    controller.getSignal('test')({idx: 2, x: 'one', y: 'two'})
    assert.deepEqual(controller.getState(), {list: ['a', 'b', 'one', 'two', 'd']})
  })
  it('should throw on bad argument', () => {
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          splice(input`list`, 1, 1, 'bar')
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({list: ['one', 'two']})
    }, /operator.splice/)
  })
})
