/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, merge, state} from './'

describe('operator.merge', () => {
  it('should merge value in model', () => {
    const controller = new Controller({
      state: {
        users: {
          john: 'John Difool'
        }
      },
      signals: {
        test: [
          merge(state`users`, {largo: 'Largo Winch'})
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {users: {
      john: 'John Difool',
      largo: 'Largo Winch'
    }})
  })
  it('should merge value from input in model', () => {
    const controller = new Controller({
      state: {
        users: {
          john: 'John Difool'
        }
      },
      signals: {
        test: [
          merge(state`users`, input`value`)
        ]
      }
    })
    controller.getSignal('test')({value: {largo: 'Largo Winch'}})
    assert.deepEqual(controller.getState(), {users: {
      john: 'John Difool',
      largo: 'Largo Winch'
    }})
  })
  it('should throw on bad argument', () => {
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          merge(input`users`, {joe: 'Joe'})
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({users: {}})
    }, /operator.merge/)
  })
})
