/* eslint-env mocha */
import DependencyStore from './DependencyStore'
import assert from 'assert'

describe('DependencyStore', () => {
  it('should add components', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo', 'bar': 'bar'})

    assert.deepEqual(depsStore.map, {
      foo: {
        entities: [component]
      },
      bar: {
        entities: [component]
      }
    })
  })
  it('should remove components', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': 'foo'})
    assert.deepEqual(depsStore.map, {foo: {
      entities: [component]
    }})
    depsStore.removeEntity(component, {'foo': true})
    assert.deepEqual(depsStore.map, {foo: {}})
  })
  it('should update components', () => {
    const depsStore = new DependencyStore()
    const component = {}
    depsStore.addEntity(component, {'foo': true})
    assert.deepEqual(depsStore.map, {foo: {
      entities: [component]
    }})
    depsStore.removeEntity(component, {'foo': true})
    depsStore.addEntity(component, {'bar': true})
    assert.deepEqual(depsStore.map, {
      foo: {},
      bar: {
        entities: [component]
      }
    })
  })
  it('should return all unique components', () => {
    const depsStore = new DependencyStore()
    const componentA = {}
    const componentB = {}
    depsStore.addEntity(componentA, {'foo': true, 'bar': true})
    depsStore.addEntity(componentB, {'foo': true})
    assert.deepEqual(depsStore.getAllUniqueEntities(), [componentA, componentB])
  })
  describe('dependency matching', () => {
    it('should return exact matches', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }]), [component])
    })
    it('should return matches on immediate and all interest', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.*': true, 'foo.**': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }]), [component])
    })
    it('should return matches on immediate', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.*': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', '0']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', '0', 'bar']
      }]), [])
    })
    it('should return matches on all', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.**': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', '0']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', '0', 'bar']
      }]), [component])
    })
    it('should return matches on all forceChildPathUpdates', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.bar.baz': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        forceChildPathUpdates: true,
        path: ['foo']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        forceChildPathUpdates: true,
        path: ['foo', 'bar']
      }]), [component])
    })
    it('should return matches on all forceChildPathUpdates with interest', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.bar.*': true, 'foo.bar.**': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        forceChildPathUpdates: true,
        path: ['foo']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        forceChildPathUpdates: true,
        path: ['foo', 'bar']
      }]), [component])
    })
    it('should handle not having interest conflicts', () => {
      const depsStore = new DependencyStore()
      const componentA = {}
      const componentB = {}
      depsStore.addEntity(componentA, {'foo.bar.**': true})
      depsStore.addEntity(componentB, {'foo.bar.baz': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar', 'baz']
      }]), [componentA, componentB])
    })
  })
})
