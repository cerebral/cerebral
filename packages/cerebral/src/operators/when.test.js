/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, state, when} from './'

describe('operators.when', () => {
  it('should check truthy value of input', () => {
    let count = 0
    const controller = new Controller({
      signals: {
        test: [
          when(input`foo`), {
            true: [() => { count++ }],
            false: []
          }
        ]
      }
    })
    controller.getSignal('test')({foo: 'bar'})
    assert.equal(count, 1)
  })
  it('should check truthy value of state', () => {
    let count = 0
    const controller = new Controller({
      state: {
        foo: false
      },
      signals: {
        test: [
          when(state`foo`), {
            true: [],
            false: [() => { count++ }]
          }
        ]
      }
    })
    controller.getSignal('test')()
    assert.equal(count, 1)
  })
})
