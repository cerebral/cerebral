/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, state, unset} from './'

describe('operators.unset', () => {
  it('should unset value in model', () => {
    const controller = new Controller({
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
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          unset(input`foo`)
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({foo: 'bar'})
    }, /operator.unset/)
  })
})
