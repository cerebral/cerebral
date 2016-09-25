import Controller from '../src/Controller'
import Computed from '../src/Computed'
import assert from 'assert'

describe('Computed', () => {
  describe('factory', () => {
    it('should create a computed factory', () => {
      const computedFactory = Computed({}, () => {})
      assert.ok(typeof computedFactory === 'function')
    })
    it('should throw when not passing correct arguments', () => {
      assert.throws(() => {
        Computed('foo', null)
      })
    })
    it('should cache computed', () => {
      const computedFactory = Computed({}, () => {})
      computedFactory()
      assert.equal(computedFactory.cache.length, 1)
      computedFactory()
      assert.equal(computedFactory.cache.length, 1)
    })
    it('should not use cache when props differ', () => {
      const computedFactory = Computed({}, () => {})
      computedFactory()
      assert.equal(computedFactory.cache.length, 1)
      computedFactory({foo: 'bar'})
      assert.equal(computedFactory.cache.length, 2)
    })
    it('should remove from cache when computed is removed', () => {
      const computedFactory = Computed({}, () => {})
      const computed = computedFactory()
      assert.equal(computedFactory.cache.length, 1)
      computed.remove()
      assert.equal(computedFactory.cache.length, 0)
    })
  })
  describe('instance', () => {
    it('should create a computed', () => {
      const computedFactory = Computed({}, () => {})
      const computed = computedFactory()
      assert.ok(typeof computed.getValue === 'function')
    })
    it('should throw when passing wrong argument', () => {
      const computedFactory = Computed({}, () => {})
      assert.throws(() => {
        computedFactory([])
      })
    })
    it('should return value', () => {
      const controller = Controller({})
      const computedFactory = Computed({}, () => {
        return 'foo'
      })
      const computed = computedFactory()
      assert.equal(computed.getValue(controller), 'foo')
    })
    it('should extract state', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const computedFactory = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computed = computedFactory()
      assert.equal(computed.getValue(controller), 'bar')
    })
    it('should cache values', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const computedFactory = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return {
          foo
        }
      })
      const computed = computedFactory()
      const value = computed.getValue(controller)
      assert.deepEqual(value, {foo: 'bar'})
      assert.equal(computed.getValue(controller), value)
    })
    it('should bust cache when path updates', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const computedFactory = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return {
          foo
        }
      })
      const computed = computedFactory()
      assert.deepEqual(computed.getValue(controller), {foo: 'bar'})
      assert.deepEqual(computed.getValue(controller), {foo: 'bar'})
      controller.model.set(['foo'], 'bar2')
      controller.flush()
      assert.deepEqual(computed.getValue(controller), {foo: 'bar2'})
    })
    it('should handle computed in computed', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const computedFactoryA = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computedFactoryB = Computed({
        foo: 'foo',
        foo2: computedFactoryA()
      }, ({foo, foo2}) => {
        return foo + foo2
      })
      const computed = computedFactoryB()
      assert.equal(computed.getValue(controller), 'barbar')
    })
    it('should bust cache when nested computed updates', () => {
      const controller = Controller({
        state: {
          foo: 'bar',
          bar: 'foo'
        }
      })
      const computedFactoryA = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computedFactoryB = Computed({
        foo: computedFactoryA(),
        bar: 'bar'
      }, ({foo, bar}) => {
        return foo + bar
      })
      const computed = computedFactoryB()
      assert.equal(computed.getValue(controller), 'barfoo')
      controller.model.set(['foo'], 'bar2')
      controller.flush()
      assert.equal(computed.getValue(controller), 'bar2foo')
    })
    it('should handle strict path updates', () => {
      const controller = Controller({
        state: {
          foo: {
            bar: 'woop'
          }
        }
      })
      const computedFactoryA = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo.bar
      })
      const computedFactoryB = Computed({
        foo: 'foo.*'
      }, ({foo}) => {
        return foo.bar
      })
      const computedA = computedFactoryA()
      const computedB = computedFactoryB()
      assert.equal(computedA.getValue(controller), 'woop')
      assert.equal(computedB.getValue(controller), 'woop')
      controller.model.set(['foo', 'bar'], 'woop2')
      controller.flush()
      assert.equal(computedA.getValue(controller), 'woop')
      assert.equal(computedB.getValue(controller), 'woop2')
    })
    it('should remove computed from dependency store', () => {
      const controller = Controller({
        state: {
          foo: 'bar'
        }
      })
      const computedFactory = Computed({
        foo: 'foo'
      }, ({foo}) => {
        return foo
      })
      const computed = computedFactory()
      assert.equal(computed.getValue(controller), 'bar')
      controller.model.set(['foo'], 'bar2')
      controller.flush()
      assert.equal(computed.getValue(controller), 'bar2')
      computed.remove()
      controller.model.set(['foo'], 'bar3')
      controller.flush()
      assert.equal(computed.getValue(controller), 'bar2')
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
