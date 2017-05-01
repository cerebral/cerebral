/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'
import {set, push} from './'
import {props, state, string} from '../tags'

describe('operator.set', () => {
  it('should set value to model', () => {
    const controller = Controller({
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
  it('should set value to props', () => {
    const controller = Controller({
      signals: {
        test: [
          set(props`foo`, 'bar'),
          ({props}) => {
            assert.equal(props.foo, 'bar')
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should set deep value to props', () => {
    const controller = Controller({
      signals: {
        test: [
          set(props`foo`, {bing: 'bor'}),
          set(props`foo.bar`, 'baz'),
          ({props}) => {
            assert.equal(props.foo.bar, 'baz')
            assert.equal(props.foo.bing, 'bor')
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should set non string value to model', () => {
    const controller = Controller({
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
  it('should set value to model from props', () => {
    const controller = Controller({
      state: {
        foo: 'bar'
      },
      signals: {
        test: [
          set(state`foo`, props`value`)
        ]
      }
    })
    controller.getSignal('test')({
      value: 'bar2'
    })
    assert.deepEqual(controller.getState(), {foo: 'bar2'})
  })
  it('should set value to model from model', () => {
    const controller = Controller({
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
  it('should throw on bad argument', (done) => {
    const controller = Controller({
      state: {
      },
      signals: {
        test: [
          set(string`foo`, 'bar')
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
  it('should copy plain object', () => {
    const controller = Controller({
      state: {
        foo: {}
      },
      signals: {
        test: [
          set(state`foo`, {}),
          set(state`foo.${props`key`}`, 'bar')
        ]
      }
    })
    controller.once('end', () => {
      assert.deepEqual(controller.getState('foo'), {'key1': 'bar'})
    })
    controller.getSignal('test')({
      key: 'key1'
    })
    controller.once('end', () => {
      assert.deepEqual(controller.getState('foo'), {'key2': 'bar'})
    })
    controller.getSignal('test')({
      key: 'key2'
    })
  })
  it('should copy array object', () => {
    const controller = Controller({
      state: {
        foo: []
      },
      signals: {
        test: [
          set(state`foo`, []),
          push(state`foo`, 'bar')
        ]
      }
    })
    controller.once('end', () => {
      assert.deepEqual(controller.getState('foo'), ['bar'])
    })
    controller.getSignal('test')()
    controller.once('end', () => {
      assert.deepEqual(controller.getState('foo'), ['bar'])
    })
    controller.getSignal('test')()
  })
})
