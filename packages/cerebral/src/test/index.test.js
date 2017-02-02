/* eslint-env mocha */
import {compute} from '..'
import {state, input} from '../tags'
import {runCompute, runAction} from '.'
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
    // it('should test a compute that gets props', () => {
    //   const testCompute = compute(props`foo`, (foo) => foo)
    //   assert.equal(runCompute(testCompute, {props: {foo: 'bar'}}), 'bar')
    // })
  })

  describe('runAction', () => {
    it('should test an action that gets state', () => {
      const testAction = ({state}) => state.get('foo')
      return runAction(testAction, {state: {foo: 'bar'}})
        .then(({output}) => assert.equal(output, 'bar'))
    })
    it('should test an action that gets input', () => {
      const testAction = ({input}) => input.foo
      return runAction(testAction, {input: {foo: 'bar'}})
        .then(({output}) => assert.equal(output, 'bar'))
    })
    it('should test an action that sets state', () => {
      const testAction = ({state}) => state.set('foo', 'baz')
      return runAction(testAction, {state: {foo: 'bar'}})
        .then(({controller}) => assert.equal(controller.getState('foo'), 'baz'))
    })
    it('should test async actions', () => {
      const testAction = () => new Promise((resolve) => {
        setTimeout(() => resolve('foo'), 1)
      })
      return runAction(testAction)
        .then(({output}) => assert.equal(output, 'foo'))
    })
  })
})
