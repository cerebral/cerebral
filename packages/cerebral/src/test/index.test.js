/* eslint-env mocha */
import {compute} from '..'
import {state, props, input} from '../tags'
import {runCompute} from '.'
import assert from 'assert'

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
