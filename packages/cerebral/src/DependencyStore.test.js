/* eslint-env mocha */
import DependencyStore from './DependencyStore'
import assert from 'assert'

describe('DependencyStore', () => {
  it('should add components', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo', 'bar': 'bar'})

    assert.deepEqual(depsStore.map, {foo: [component], bar: [component]})
  })
  it('should remove components', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo'})
    assert.deepEqual(depsStore.map, {foo: [component]})
    depsStore.removeEntity(component, {'foo': 'foo'})
    assert.deepEqual(depsStore.map, {foo: []})
  })
  it('should update components', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo'})
    assert.deepEqual(depsStore.map, {foo: [component]})
    depsStore.removeEntity(component, {'foo': 'foo'})
    depsStore.addEntity(component, {'bar': 'bar'})
    assert.deepEqual(depsStore.map, {foo: [], bar: [component]})
  })
  it('should return all unique components', () => {
    const depsStore = new DependencyStore()
    const componentA = {}
    const componentB = {}
    depsStore.addEntity(componentA, {'foo': 'foo', 'bar': 'bar'})
    depsStore.addEntity(componentB, {'foo': 'foo'})
    assert.deepEqual(depsStore.getAllUniqueEntities(), [componentA, componentB])
  })
  describe('strict', () => {
    it('should STRICTLY return components matching normal deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo'})
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: true
      }), [component])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: true}
      }), [])
    })
    it('should STRICTLY return components matching immediate deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo.*'})
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: true
      }), [component])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: true}
      }), [component])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: {mip: true}}
      }), [])
    })
    it('should STRICTLY return components matching nested deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo.**'})
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: true
      }), [component])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: true}
      }), [component])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: {mip: true}}
      }), [component])
    })
    it('should STRICTLY return components matching deep deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo.bar.baz'})
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: true
      }), [])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: true}
      }), [])
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: {bar: {baz: true}}
      }), [component])
    })
    it('should STRICTLY return unique components', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo', 'bar': 'bar'})
      assert.deepEqual(depsStore.getStrictUniqueEntities({
        foo: true,
        bar: true
      }), [component])
    })
  })
  describe('non strict', () => {
    it('should return components where changemap matches dependency path', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo'})
      assert.deepEqual(depsStore.getUniqueEntities({
        foo: {bar: true}
      }), [component])
    })
    it('should return components where dependency path matches change map', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo.bar.baz'})
      assert.deepEqual(depsStore.getUniqueEntities({
        foo: {
          bar: true
        }
      }), [component])
    })
    it('should return unique components', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo', 'bar': 'bar'})
      assert.deepEqual(depsStore.getUniqueEntities({
        foo: true,
        bar: true
      }), [component])
    })
  })
})
