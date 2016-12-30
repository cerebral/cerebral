/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {merge} from './'
import {state, input} from '../tags'

describe('operator.merge', () => {
  it('should merge value in model', () => {
    const controller = Controller({
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
    const controller = Controller({
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
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          merge(input`users`, {joe: 'Joe'})
        ]
      }
    })

    assert.throws(() => {
      controller.getSignal('test')()
    }, /operator.merge/)
  })
  it('should create object if no value', () => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          merge(state`users`, {joe: 'Joe'})
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {users: {joe: 'Joe'}})
  })
  it('should merge multiple objects', () => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          merge(state`users`, {joe: 'Joe'}, input`extend`, {
            bob: input`bob`
          })
        ]
      }
    })
    controller.getSignal('test')({
      extend: {
        jack: 'Jack'
      },
      bob: 'Bob'
    })
    assert.deepEqual(controller.getState(), {
      users: {
        joe: 'Joe',
        jack: 'Jack',
        bob: 'Bob'
      }
    })
  })
})
