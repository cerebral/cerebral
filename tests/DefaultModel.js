import Model from '../src/DefaultModel'
import assert from 'assert'

describe('DefaultModel', () => {
  it('should instantiate with initial state', () => {
    const model = new Model({
      foo: 'bar'
    })
    assert.equal(model.get(['foo']), 'bar')
  })
  it('should instantiate with initial state', () => {
    const model = new Model({
      foo: 'bar'
    })
    assert.equal(model.get(['foo']), 'bar')
  })
  it('should grab nested state', () => {
    const model = new Model({
      foo: {
        bar: 'value'
      }
    })
    assert.equal(model.get(['foo', 'bar']), 'value')
  })
  it('should be able to flush changed paths', () => {
    const model = new Model({
      foo: {
        bar: 'value'
      }
    })
    model.set(['foo', 'bar'], 'value2')
    assert.deepEqual(model.flush(), {foo: {bar: true}})
  })

  describe('SET', () => {
    it('should be able to set state', () => {
      const model = new Model({})
      model.set(['foo'], 'bar')
      assert.deepEqual(model.get(), {foo: 'bar'})
    })
  })
  describe('PUSH', () => {
    it('should be able to push to array', () => {
      const model = new Model({
        list: []
      })
      model.push(['list'], 'bar')
      assert.deepEqual(model.get(), {list: ['bar']})
    })
  })
  describe('MERGE', () => {
    it('should be able to merge objects', () => {
      const model = new Model({
        foo: {
          valA: 'foo'
        }
      })
      model.merge(['foo'], {valB: 'bar'})
      assert.deepEqual(model.get(), {foo: {valA: 'foo', valB: 'bar'}})
    })
    it('should flush changes to merged keys as well', () => {
      const model = new Model({
        foo: {
          valA: 'foo'
        }
      })
      model.merge(['foo'], {valB: 'bar'})
      assert.deepEqual(model.flush(), {foo: {valB: true}})
    })
  })
  describe('POP', () => {
    it('should be able to pop arrays', () => {
      const model = new Model({
        list: ['foo', 'bar']
      })
      model.pop(['list'])
      assert.deepEqual(model.get(), {list: ['foo']})
    })
  })
  describe('SHIFT', () => {
    it('should be able to shift arrays', () => {
      const model = new Model({
        list: ['foo', 'bar']
      })
      model.shift(['list'])
      assert.deepEqual(model.get(), {list: ['bar']})
    })
  })
  describe('UNSHIFT', () => {
    it('should be able to unshift arrays', () => {
      const model = new Model({
        list: ['foo']
      })
      model.unshift(['list'], 'bar')
      assert.deepEqual(model.get(), {list: ['bar', 'foo']})
    })
  })
  describe('SPLICE', () => {
    it('should be able to splice arrays', () => {
      const model = new Model({
        list: ['foo', 'bar']
      })
      model.splice(['list'], 1, 1, 'bar2')
      assert.deepEqual(model.get(), {list: ['foo', 'bar2']})
    })
  })
  describe('UNSET', () => {
    it('should be able to unset keys', () => {
      const model = new Model({
        foo: 'bar'
      })
      model.unset(['foo'])
      assert.deepEqual(model.get(), {})
    })
  })
})
