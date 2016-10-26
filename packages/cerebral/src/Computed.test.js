/* eslint-env mocha */
import Controller from './Controller'
import Computed from './Computed'
import assert from 'assert'

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
        strictRender: true,
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
  })
})
/*
var Computed = require('./../src/Computed.js')
var suite = {}

function reset () {
  Computed.registry = {}
  Computed.cache = {}
}

suite['should create computed'] = function (test) {
  reset()
  var computed = Computed({
    foo: 'foo'
  }, function (state) {
    return state.foo
  })
  test.equals(computed().get({
    foo: 'bar'
  }), 'bar')
  test.done()
}

suite['should add cached result to registry'] = function (test) {
  reset()
  var stateDeps = {
    foo: 'foo'
  }
  var computedCb = function (state) {
    return state.foo
  }
  var cacheKey = JSON.stringify(stateDeps) + '{}' + computedCb.toString().replace(/\s/g, '')
  var computed = Computed(stateDeps, computedCb)
  computed().get({
    foo: 'bar'
  })
  test.equals(Computed.cache[cacheKey], 'bar')
  test.done()
}

suite['should add cache key to path'] = function (test) {
  reset()
  var stateDeps = {
    foo: 'foo'
  }
  var computedCb = function (state) {
    return state.foo
  }

  var cacheKey = JSON.stringify(stateDeps) + '{}' + computedCb.toString().replace(/\s/g, '')
  var computed = Computed(stateDeps, computedCb)
  computed()
  test.ok(Computed.registry['foo'].indexOf(cacheKey) >= 0)
  test.done()
}

suite['should return cached result'] = function (test) {
  reset()
  var obj = {}
  var state = {
    foo: obj
  }
  var stateDeps = {
    foo: 'foo'
  }
  var computed = Computed(stateDeps, function (state) {
    return state.foo
  })
  test.equals(computed().get(state), obj)
  state.foo = {}
  test.equals(computed().get(state), obj)
  test.done()
}

suite['should return new result when cache is cleared'] = function (test) {
  reset()
  var obj = {}
  var obj2 = {}
  var state = {
    foo: obj
  }
  var stateDeps = {
    foo: 'foo'
  }
  var computed = Computed(stateDeps, function (state) {
    return state.foo
  })
  test.equals(computed().get(state), obj)
  state.foo = obj2
  Computed.updateCache({
    foo: true
  })
  test.equals(computed().get(state), obj2)
  test.done()
}

suite['should support nested computed'] = function (test) {
  reset()
  var state = {
    foo: 'bar'
  }
  var computedA = Computed({
    foo: 'foo'
  }, function (state) {
    return state.foo.toUpperCase()
  })
  var computedB = Computed({
    foo: computedA()
  }, function (state) {
    return state.foo + 'woop'
  })

  test.equals(computedB().get(state), 'BARwoop')
  state.foo = 'foo'
  Computed.updateCache({
    foo: true
  })
  test.equals(computedA().get(state), 'FOO')
  test.equals(computedB().get(state), 'FOOwoop')
  test.done()
}

suite['should throw when passing props not an object'] = function (test) {
  reset()
  var computed = Computed({
    foo: 'foo'
  }, function (state) {
    return state.foo
  })
  test.throws(function () {
    computed([]).get({
      foo: 'bar'
    })
  })
  test.throws(function () {
    computed('test').get({
      foo: 'bar'
    })
  })
  test.throws(function () {
    computed(null).get({
      foo: 'bar'
    })
  })
  test.done()
}

module.exports = { computed: suite }
*/
