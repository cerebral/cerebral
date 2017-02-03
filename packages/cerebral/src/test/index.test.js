/* eslint-env mocha */
import {compute} from '..'
import {state, input, props} from '../tags'
import {runCompute, runAction, runSignal} from '.'
import assert from 'assert'

describe('test helpers', () => {
  describe('runCompute', () => {
    it('should test a compute that gets state', () => {
      const testCompute = compute(state`foo`, (foo) => foo)
      assert.equal(runCompute(testCompute, {state: {foo: 'bar'}}), 'bar')
    })
    it('should test a compute that gets input', () => {
      const testCompute = compute(input`foo`, (foo) => foo)
      assert.equal(runCompute(testCompute, {input: {foo: 'bar'}}), 'bar')
    })
    it('should test a compute that gets props', () => {
      const testCompute = compute(props`foo`, (foo) => foo)
      assert.equal(runCompute(testCompute, {props: {foo: 'bar'}}), 'bar')
    })
  })

  describe('runAction', () => {
    it('should test an action that gets state', () => {
      const testAction = function testAction ({state}) {
        return {foo: state.get('foo')}
      }
      return runAction(testAction, {state: {foo: 'bar'}})
        .then(({output}) => assert.equal(output.foo, 'bar'))
    })
    it('should test an action that gets input', () => {
      const testAction = function testAction ({input}) {
        return {foo: input.foo}
      }
      return runAction(testAction, {input: {foo: 'bar'}})
        .then(({output}) => assert.equal(output.foo, 'bar'))
    })
    it('should test an action that sets state', () => {
      const testAction = function testAction ({state}) {
        state.set('foo', 'baz')
      }
      return runAction(testAction, {state: {foo: 'bar'}})
        .then(({state}) => assert.equal(state.foo, 'baz'))
    })
    it('should test async actions', () => {
      const testAction = function testAction () {
        return new Promise((resolve) => {
          setTimeout(() => resolve({foo: 'bar'}), 1)
        })
      }
      return runAction(testAction)
        .then(({output}) => assert.equal(output.foo, 'bar'))
    })
  })

  describe('runSignal', () => {
    it('should test a signal with named actions', () => {
      const testSignal = [
        function action1 ({input}) {
          return {bar: 'bar'}
        },
        function action2 ({input}) {
          return {baz: 'baz'}
        }
      ]
      return runSignal(testSignal, {input: {foo: 'foo'}}, {recordActions: 'byName'})
        .then(({action1, action2}) => {
          assert.equal(action1.input.foo, 'foo')
          assert.equal(action1.output.bar, 'bar')
          assert.equal(action2.input.bar, 'bar')
          assert.equal(action2.output.baz, 'baz')
        })
    })
    it('should test a signal with indexed actions', () => {
      const testSignal = [
        function action1 ({input}) {
          return {bar: 'bar'}
        },
        function action2 ({input}) {
          return {baz: 'baz'}
        }
      ]
      return runSignal(testSignal, {input: {foo: 'foo'}}, {recordActions: true})
        .then((response) => {
          assert.equal(response[0].input.foo, 'foo')
          assert.equal(response[0].output.bar, 'bar')
          assert.equal(response[1].input.bar, 'bar')
          assert.equal(response[1].output.baz, 'baz')
        })
    })
  })
})
