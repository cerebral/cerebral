/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {toggle} from './'
import {input, state} from '../tags'

describe('operator.toggle', () => {
  it('should toggle state', () => {
    const controller = Controller({
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
    const controller = Controller({
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
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          toggle(input`foo`)
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.toggle/)
  })
})
