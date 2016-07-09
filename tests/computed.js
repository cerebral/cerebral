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
  var cacheKey = JSON.stringify(stateDeps)
  var computed = Computed(stateDeps, function (state) {
    return state.foo
  })
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
  var cacheKey = JSON.stringify(stateDeps)
  var computed = Computed(stateDeps, function (state) {
    return state.foo
  })
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

module.exports = { computed: suite }
