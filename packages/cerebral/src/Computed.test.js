/* eslint-env mocha */
import Controller from './Controller'
import Computed from './Computed'
import assert from 'assert'
import {state} from './tags'

describe('Computed', () => {
  describe('factory', () => {
    it('should create a computed factory', () => {
      const computedFactory = Computed({}, () => {}).factory.create
      assert.ok(typeof computedFactory === 'function')
    })
    it('should throw when not passing correct arguments', () => {
      assert.throws(() => {
        Computed('foo', null)
      })
    })
    it('should cache computed', () => {
      const computed = Computed({}, () => {})
      assert.equal(computed.factory.cache.length, 1)
      computed.props()
      assert.equal(computed.factory.cache.length, 1)
    })
    it('should not use cache when props differ', () => {
      const computed = Computed({}, () => {})
      assert.equal(computed.factory.cache.length, 1)
      computed.props({foo: 'bar'})
      assert.equal(computed.factory.cache.length, 2)
    })
    it('should remove from cache when computed is removed', () => {
      const computed = Computed({}, () => {})
      assert.equal(computed.factory.cache.length, 1)
      computed.remove()
      assert.equal(computed.factory.cache.length, 0)
    })
  })
  describe('instance', () => {
    it('should create a computed', () => {
      const computed = Computed({}, () => {})
      assert.ok(typeof computed.getValue === 'function')
    })
    it('should throw when passing wrong argument', () => {
      const computed = Computed({}, () => {})
      assert.throws(() => {
        computed.props([])
      })
    })
    it('should return value', () => {
      const model = Controller({}).model
      const computed = Computed({}, () => {
        return 'foo'
      })
      assert.equal(computed.getValue(model), 'foo')
    })
    it('should extract state', () => {
      const model = Controller({
        state: {
          foo: 'bar'
        }
      }).model
      const computed = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      assert.equal(computed.getValue(model), 'bar')
    })
    it('should cache values', () => {
      const model = Controller({
        state: {
          foo: 'bar'
        }
      }).model
      const computed = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return {
          foo
        }
      })
      const value = computed.getValue(model)
      assert.deepEqual(value, {foo: 'bar'})
      assert.equal(computed.getValue(model), value)
    })
    it('should bust cache when path updates', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const model = controller.model
      const computed = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return {
          foo
        }
      })
      assert.deepEqual(computed.getValue(model), {foo: 'bar'})
      assert.deepEqual(computed.getValue(model), {foo: 'bar'})
      model.set(['foo'], 'bar2')
      controller.flush()
      assert.deepEqual(computed.getValue(model), {foo: 'bar2'})
    })
    it('should handle computed in computed', () => {
      const model = Controller({
        state: {
          foo: 'bar'
        }
      }).model
      const computedA = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computedB = Computed({
        foo: 'foo',
        foo2: computedA
      }, ({foo, foo2}) => {
        return foo + foo2
      })
      assert.equal(computedB.getValue(model), 'barbar')
    })
    it('should bust cache when nested computed updates', () => {
      const controller = Controller({
        state: {
          foo: 'bar',
          bar: 'foo'
        }
      })
      const model = controller.model
      const computedA = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computedB = Computed({
        foo: computedA,
        bar: 'bar'
      }, ({foo, bar}) => {
        return foo + bar
      })
      assert.equal(computedB.getValue(model), 'barfoo')
      model.set(['foo'], 'bar2')
      controller.flush()
      assert.equal(computedB.getValue(model), 'bar2foo')
    })
    it('should handle strict path updates', () => {
      const controller = Controller({
        options: {strictRender: true},
        state: {
          foo: {
            bar: 'woop'
          }
        }
      })
      const model = controller.model
      const computedA = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo.bar
      })
      const computedB = Computed({
        foo: 'foo.*'
      }, ({foo}) => {
        return foo.bar
      })
      assert.equal(computedA.getValue(model), 'woop')
      assert.equal(computedB.getValue(model), 'woop')
      model.set(['foo', 'bar'], 'woop2')
      controller.flush()
      assert.equal(computedA.getValue(model), 'woop')
      assert.equal(computedB.getValue(model), 'woop2')
    })
    it('should use cache on state.compute when told so', () => {
      const nestedComputed = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computed = Computed({
        foo: 'foo',
        nestedFoo: nestedComputed
      }, ({foo, nestedFoo}) => {
        return foo + nestedFoo
      })
      const controller = Controller({
        state: {
          foo: 'bar'
        },
        signals: {
          test: [
            ({state}) => {
              assert.equal(state.compute(computed), 'barbar')
              state.set('foo', 'bar2')
              assert.deepEqual(state.compute(computed, true), 'barbar')
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should remove computed from dependency store', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const model = controller.model
      const computed = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      assert.equal(computed.getValue(model), 'bar')
      model.set(['foo'], 'bar2')
      controller.flush()
      assert.equal(computed.getValue(model), 'bar2')
      computed.remove()
      model.set(['foo'], 'bar3')
      controller.flush()
      assert.equal(computed.getValue(model), 'bar2')
    })
    it('should support tags', () => {
      const controller = Controller({
        state: {
          bar: 'bar',
          items: {0: 'foo', 1: 'baz'},
          currentItemKey: '1'
        }
      })
      const model = controller.model
      const computed = Computed({
        bar: state`bar`,
        baz: state`items.${state`currentItemKey`}`
      }, ({foo, bar, baz}) => {
        return foo + bar + baz
      })
      const withProps = computed.props({foo: 'foo'})
      assert.equal(withProps.getValue(model), 'foobarbaz')
    })
  })
})
