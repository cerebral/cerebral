/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {pop} from './'
import {input, state} from '../tags'

describe('operator.pop', () => {
  it('should pop value from model', () => {
    const controller = Controller({
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
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          pop(input`list`)
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.pop/)
  })
})
