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
  describe('strict', () => {
    it('should STRICTLY return components matching normal deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar']
      }]), [])
    })
    it('should STRICTLY return components matching immediate deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.*': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar', 'mip']
      }]), [])
    })
    it('should STRICTLY return components matching nested deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.**': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar']
      }]), [component])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar', 'mip']
      }]), [component])
    })
    it('should STRICTLY return components matching deep deps', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo.bar.baz': true})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }]), [])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar']
      }]), [])
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo', 'bar', 'baz']
      }]), [component])
    })
    it('should STRICTLY return unique components', () => {
      const depsStore = new DependencyStore()
      const component = {}
      depsStore.addEntity(component, {'foo': 'foo', 'bar': 'bar'})
      assert.deepEqual(depsStore.getUniqueEntities([{
        path: ['foo']
      }, {
        path: ['bar']
      }]), [component])
    })
  })
})
