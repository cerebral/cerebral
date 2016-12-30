/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {unshift} from './'
import {input, state} from '../tags'

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
  it('should unshift value from input in model', () => {
    const controller = Controller({
      state: {
        list: ['a', 'b']
      },
      signals: {
        test: [
          unshift(state`list`, input`value`)
        ]
      }
    })
    controller.getSignal('test')({value: 'x'})
    assert.deepEqual(controller.getState(), {list: ['x', 'a', 'b']})
  })
  it('should throw on bad argument', () => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          unshift(input`list`, 'bar')
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.unshift/)
  })
})
