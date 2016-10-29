/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, pop, state} from './'

describe('operator.pop', () => {
  it('should pop value from model', () => {
    const controller = new Controller({
      state: {
        list: ['a', 'b', 'c']
      },
      signals: {
        test: [
          pop(state`list`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {list: ['a', 'b']})
  })
  it('should throw on bad argument', () => {
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          pop(input`list`)
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({list: ['one']})
    }, /operator.pop/)
  })
})
