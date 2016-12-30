/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {shift} from './'
import {input, state} from '../tags'

describe('operator.shift', () => {
  it('should shift value in model', () => {
    const controller = Controller({
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
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          shift(input`list`, 'bar')
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.shift/)
  })
})
