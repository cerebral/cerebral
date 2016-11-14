/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, state, equals} from './'

describe('operators.equals', () => {
  it('should go down path based on input', () => {
    let count = 0
    const controller = new Controller({
      signals: {
        test: [
          equals(input`foo`), {
            bar: [() => { count++ }],
            otherwise: []
          }
        ]
      }
    })
    controller.getSignal('test')({foo: 'bar'})
    assert.equal(count, 1)
  })
  it('should go down path based on state', () => {
    let count = 0
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          equals(state`foo`), {
            bar: [() => { count++ }],
            otherwise: []
          }
        ]
      }
    })
    controller.getSignal('test')()
    assert.equal(count, 1)
  })
})
