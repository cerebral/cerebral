/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {input, set, state} from './'

describe('operator.set', () => {
  it('should set value to model', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          set(state`foo`, 'bar2')
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {foo: 'bar2'})
  })
  it('should set non string value to model', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          set(state`foo`, {bar: 'baz'})
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), {foo: {bar: 'baz'}})
  })
  it('should set value to model from input', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          set(state`foo`, input`value`)
        ]
      }
    })
    controller.getSignal('test')({
      value: 'bar2'
    })
    assert.deepEqual(controller.getState(), {foo: 'bar2'})
  })
  it('should set value to model from model', () => {
    const controller = new Controller({
      state: {
        foo: 'bar',
        grabValue: 'bar2'
      },
      signals: {
        test: [
          set(state`foo`, state`grabValue`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.equal(controller.getState().foo, 'bar2')
  })
  it('should throw on bad argument', () => {
    const controller = new Controller({
      state: {
      },
      signals: {
        test: [
          set(input`foo`, 'bar')
        ]
      }
    })
    assert.throws(() => {
      controller.getSignal('test')({foo: 'baz'})
    }, /operator.set/)
  })
})
