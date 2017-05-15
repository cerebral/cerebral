/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import { increment } from './'
import { props, state, string } from '../tags'

describe('operator.increment', () => {
  it('should increment value in model with value of one by default', () => {
    const controller = Controller({
      state: {
        foo: 0
      },
      signals: {
        test: [
          increment(state`foo`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), { foo: 1 })
  })
  it('should increment value in model with given value', () => {
    const controller = Controller({
      state: {
        foo: 0
      },
      signals: {
        test: [
          increment(state`foo`, 2)
        ]
      }
    })
    controller.getSignal('test')()
    assert.deepEqual(controller.getState(), { foo: 2 })
  })
  it('should increment value in props with value of one by default', () => {
    const controller = Controller({
      signals: {
        test: [
          increment(props`foo`),
          ({ props }) => {
            assert.equal(props.foo, 1)
          }
        ]
      }
    })
    controller.getSignal('test')({
      foo: 0
    })
  })
  it('should increment value in props with given value', () => {
    const controller = Controller({
      signals: {
        test: [
          increment(props`foo`, 2),
          ({ props }) => {
            assert.equal(props.foo, 2)
          }
        ]
      }
    })
    controller.getSignal('test')({
      foo: 0
    })
  })
  it('should increment value to model from props', () => {
    const controller = Controller({
      state: {
        foo: 1
      },
      signals: {
        test: [
          increment(state`foo`, props`value`)
        ]
      }
    })
    controller.getSignal('test')({
      value: 1
    })
    assert.deepEqual(controller.getState(), { foo: 2 })
  })
  it('should increment value to props from model', () => {
    const controller = Controller({
      state: {
        foo: 2
      },
      signals: {
        test: [
          increment(props`value`, state`foo`),
          ({ props }) => {
            assert.equal(props.value, 3)
          }
        ]
      }
    })
    controller.getSignal('test')({
      value: 1
    })
  })
  it('should increment value to props from props', () => {
    const controller = Controller({
      signals: {
        test: [
          increment(props`value`, props`grabValue`),
          ({ props }) => {
            assert.equal(props.value, 3)
          }
        ]
      }
    })
    controller.getSignal('test')({
      value: 1,
      grabValue: 2
    })
  })
  it('should increment value to model from model', () => {
    const controller = Controller({
      state: {
        foo: 1,
        grabValue: 2
      },
      signals: {
        test: [
          increment(state`foo`, state`grabValue`)
        ]
      }
    })
    controller.getSignal('test')()
    assert.equal(controller.getState().foo, 3)
  })
  it('should throw on bad target argument', (done) => {
    const controller = Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          increment(string`foo`)
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
  it('should throw on bad value argument', (done) => {
    const controller = Controller({
      state: {
        foo: 0
      },
      signals: {
        test: [
          increment(string`foo`, 'bar')
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
})
