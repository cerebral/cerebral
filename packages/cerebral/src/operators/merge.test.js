/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {merge} from './'
import {state, props} from '../tags'

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
  it('should merge value from props in model', () => {
    const controller = Controller({
      state: {
        users: {
          john: 'John Difool'
        }
      },
      signals: {
        test: [
          merge(state`users`, props`value`)
        ]
      }
    })
    controller.getSignal('test')({value: {largo: 'Largo Winch'}})
    assert.deepEqual(controller.getState(), {users: {
      john: 'John Difool',
      largo: 'Largo Winch'
    }})
  })
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          merge(props`users`, {joe: 'Joe'})
        ]
      }
    })

    controller.removeListener('error')
    controller.once('error', (error) => {
      assert.ok(error)
      done()
    })

    controller.getSignal('test')()
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
          merge(state`users`, {joe: 'Joe'}, props`extend`, {
            bob: props`bob`
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
