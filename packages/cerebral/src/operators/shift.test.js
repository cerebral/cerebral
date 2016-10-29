/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, shift, state} from './'

describe('operator.shift', () => {
  it('should shift value in model', () => {
    const controller = new Controller({
      state: {
        list: ['a', 'b', 'c']
      },
      signals: {
        test: [
          shift(state`list`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['b', 'c']})
  })
  it('should throw on bad argument', () => {
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          shift(input`list`, 'bar')
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({list: ['one']})
    }, /operator.shift/)
  })
})
