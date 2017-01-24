/* eslint-env mocha */
import {compute} from './'
import {state, props} from './tags'
import assert from 'assert'

describe('Compute', () => {
  it('should compute a value', () => {
    const computed = compute(() => {
      return 'foo'
    })
    assert.equal(computed.getValue(), 'foo')
  })
  it('should pass get into function', () => {
    const computed = compute((get) => {
      return get(state`foo`)
    })
    assert.equal(computed.getValue({
      state () { return 'foo' }
    }), 'foo')
  })
  it('should pass previous args into functions', () => {
    const computed = compute('foo', (foo, get) => {
      return foo + get(props`foo`)
    })
    assert.equal(computed.getValue({
      props () { return 'foo' }
    }), 'foofoo')
  })
  it('should resolve tags', () => {
    const computed = compute(state`foo`, (foo) => {
      return foo
    })
    assert.equal(computed.getValue({
      state () { return 'foo' }
    }), 'foo')
  })
  it('should allow computed as previous arg', () => {
    const computedA = compute(() => {
      return 'foo'
    })
    const computedB = compute(computedA, (computedAValue) => {
      return computedAValue
    })
    assert.equal(computedB.getValue(), 'foo')
  })
  it('should allow multiple functions', () => {
    const computed = compute(() => {
      return 'foo'
    }, 'bar', (foo, bar) => {
      return foo + bar
    }, (foobar) => {
      return foobar + 'baz'
    })
    assert.equal(computed.getValue(), 'foobarbaz')
  })
})
