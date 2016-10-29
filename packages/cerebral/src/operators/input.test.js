/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, set, state} from './'

describe('operator.input', () => {
  it('should read value from input', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          set(state`foo`, input`foo`)
        ]
      }
    })
    controller.getSignal('test')({foo: 'baz'})
    assert.deepEqual(controller.getState(), {foo: 'baz'})
  })
})
