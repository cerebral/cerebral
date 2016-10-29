/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, state, toggle} from './'

describe('operator.toggle', () => {
  it('should toggle state', () => {
    const controller = new Controller({
      state: {
        foo: true
      },
      signals: {
        test: [
          toggle(state`foo`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {foo: false})
  })
  it('should toggle state with input', () => {
    const controller = new Controller({
      state: {
        todos: {
          one: true,
          two: false
        }
      },
      signals: {
        test: [
          toggle(state`todos.${input`ref`}`)
        ]
      }
    })
    controller.getSignal('test')({ref: 'one'})
    assert.deepEqual(controller.getState(), {todos: {one: false, two: false}})
  })
  it('should throw on bad argument', () => {
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          toggle(input`foo`)
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({foo: true})
    }, /operator.toggle/)
  })
})
