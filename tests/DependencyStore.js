/* eslint-env mocha */
import DependencyStore from '../src/DependencyStore'
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
  it('should return components matching normal deps', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo'})
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: true
    }), [component])
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: {bar: true}
    }), [])
  })
  it('should return components matching immediate deps', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo.*'})
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: true
    }), [component])
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: {bar: true}
    }), [component])
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: {bar: {mip: true}}
    }), [])
  })
  it('should return components matching nested deps', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo.**'})
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: true
    }), [component])
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: {bar: true}
    }), [component])
    assert.deepEqual(depsStore.getUniqueEntities({
      foo: {bar: {mip: true}}
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
  it('should return all unique components', () => {
    const depsStore = new DependencyStore()
    const componentA = {}
    const componentB = {}
    depsStore.addEntity(componentA, {'foo': 'foo', 'bar': 'bar'})
    depsStore.addEntity(componentB, {'foo': 'foo'})
    assert.deepEqual(depsStore.getAllUniqueEntities(), [componentA, componentB])
  })
})
