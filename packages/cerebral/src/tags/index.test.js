/* eslint-env mocha */
import {state, input} from './'
import assert from 'assert'

describe('Tags', () => {
  it('should return value using object and path', () => {
    const tag = state`foo.bar`
    const stateObject = {foo: {bar: 'baz'}}
    assert.equal(tag({state: stateObject}).value, 'baz')
  })
  it('should return value using function and path', () => {
    const tag = state`foo.bar`
    const stateFunc = (path) => {
      assert.equal(path, 'foo.bar')
      return 'baz'
    }
    assert.equal(tag({state: stateFunc}).value, 'baz')
  })
  it('should compose tags', () => {
    const tag = state`foo.${state`bar`}`
    const stateObject = {foo: {baz: 'mip'}, bar: 'baz'}
    assert.equal(tag({state: stateObject}).value, 'mip')
  })
  it('should throw when invalid tag composition', () => {
    const tag = state`foo.${null}`
    const stateObject = {foo: 'bar'}
    assert.throws(() => {
      tag({state: stateObject}).value
    })
  })
  it('should throw when invalid tag is used', () => {
    const tag = state`foo.${null}`
    const stateObject = {foo: 'bar'}
    assert.throws(() => {
      tag().value
    })
  })
  it('should throw when invalid tag is composed', () => {
    const tag = state`foo.${input`foo`}`
    const stateObject = {foo: 'bar'}
    assert.throws(() => {
      tag({state: stateObject}).value
    })
  })
  it('should return path', () => {
    const tag = state`foo.bar`
    const stateObject = {}
    assert.equal(tag({state: stateObject}).path, 'foo.bar')
  })
  it('should return dynamic path', () => {
    const tag = state`foo.${state`bar`}`
    const stateObject = {bar: 'baz'}
    assert.equal(tag({state: stateObject}).path, 'foo.baz')
  })
  it('should return all tags', () => {
    const tag = state`foo.${state`bar`}`
    const stateObject = {foo: {baz: 'mip'}, bar: 'baz'}
    const tags = tag({state: stateObject}).tags
    assert.equal(tags[0].target, 'state')
    assert.equal(tags[0].path, 'foo.baz')
    assert.equal(tags[0].value, 'mip')
    assert.equal(tags[1].target, 'state')
    assert.equal(tags[1].path, 'bar')
    assert.equal(tags[1].value, 'baz')
  })
})
