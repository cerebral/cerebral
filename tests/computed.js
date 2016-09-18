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
