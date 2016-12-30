/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {unset} from './'
import {input, state} from '../tags'

describe('operator.unset', () => {
  it('should unset value in model', () => {
    const controller = Controller({
      state: {
        foo: 'bar',
        bar: 'baz'
      },
      signals: {
        test: [
          unset(state`foo`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {bar: 'baz'})
  })
  it('should throw on bad argument', () => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          unset(input`foo`)
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.unset/)
  })
})
