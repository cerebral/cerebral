/* eslint-env mocha */
import {state, props} from './'
import assert from 'assert'

describe('Tags', () => {
  it('should return value using function and path', () => {
    const tag = state`foo.bar`
    const stateFunc = (path) => {
      assert.equal(path, 'foo.bar')
      return 'baz'
    }
    assert.equal(tag.getValue({state: stateFunc}), 'baz')
  })
  it('should compose tags', () => {
    const tag = state`foo.${state`bar`}`
    const stateObject = {foo: {baz: 'mip'}, bar: 'baz'}
    assert.equal(tag.getValue({state: stateObject}), 'mip')
  })
  it('should throw when invalid tag is used', () => {
    const tag = state`foo.${null}`
    assert.throws(() => {
      tag.getValue()
    })
  })
  it('should throw when invalid tag is composed', () => {
    const tag = state`foo.${props`foo`}`
    const stateObject = {foo: 'bar'}
    assert.throws(() => {
      tag.getValue({state: stateObject})
    })
  })
  it('should throw when invalid path is used', () => {
    const tag = props`foo.bar`
    const propsObject = {}
    assert.throws(() => {
      tag.getValue({props: propsObject})
    })
  })
  it('should throw on undefined interpolated value', () => {
    const bar = void 0
    assert.throws(() => {
      props`foo.${bar}`
    })
    assert.throws(() => {
      props`baz.${'bar'}.${bar}`
    })
  })
  it('should NOT throw on undefined value', () => {
    const tagA = props`foo.bar`
    const tagB = props`baz`
    const propsObject = {foo: {}}
    assert.doesNotThrow(() => {
      tagA.getValue({props: propsObject})
      tagB.getValue({props: propsObject})
    })
  })
  it('should return path', () => {
    const tag = state`foo.bar`
    const stateObject = {}
    assert.equal(tag.getPath({state: stateObject}), 'foo.bar')
  })
  it('should return dynamic path', () => {
    const tag = state`foo.${state`bar`}`
    const stateObject = {bar: 'baz'}
    assert.equal(tag.getPath({state: stateObject}), 'foo.baz')
  })
  it('should return all tags', () => {
    const tag = state`foo.${state`bar`}`
    const stateObject = {foo: {baz: 'mip'}, bar: 'baz'}
    const getters = {state: stateObject}
    const tags = tag.getTags(getters)
    assert.equal(tags[0].type, 'state')
    assert.equal(tags[0].getPath(getters), 'foo.baz')
    assert.equal(tags[0].getValue(getters), 'mip')
    assert.equal(tags[1].type, 'state')
    assert.equal(tags[1].getPath(getters), 'bar')
    assert.equal(tags[1].getValue(getters), 'baz')
  })
  it('should have string representation', () => {
    const tag = state`foo.${state`bar`}`
    assert.equal(tag.toString(), 'state`foo.${state`bar`}`')// eslint-disable-line
  })
})
