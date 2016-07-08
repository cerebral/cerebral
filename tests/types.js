var Controller = require('./../src/index.js').Controller
var suite = {}
var types = require('./../src/types.js')

var Model = function () {
  return function () {
    return {

    }
  }
}

suite['should validate inputs'] = function (test) {
  var ctrl = Controller(Model)
  var action = function () {}
  action.input = {
    foo: String
  }
  var signal = [
    action
  ]

  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
  })
  test.throws(function () {
    ctrl.getSignals().test({
      foo: 123
    }, {immediate: true})
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test({
      foo: 'bar'
    }, {immediate: true})
  })
  test.done()
}

suite['should validate default inputs'] = function (test) {
  var ctrl = Controller(Model)
  var action = function () {}
  action.input = {
    foo: String
  }
  action.defaultInput = {
    foo: 123
  }
  var signal = [
    action
  ]

  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
  })
  test.done()
}

suite['should validate ouput'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args, state, output) {
    output({
      foo: 123
    })
  }
  action.output = {
    foo: String
  }
  var signal = [
    action, function () {}
  ]

  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
  })
  test.done()
}

suite['should validate outputs'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args, state, output) {
    output.success({
      foo: 123
    })
  }
  action.outputs = {
    success: {
      foo: String
    }
  }
  var signal = [
    action, {success: []}
  ]
  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
  })
  test.done()
}

suite['should validate String'] = function (test) {
  test.ok(types(String, '123'))
  test.ok(!types(String, undefined))
  test.ok(!types(String, null))
  test.ok(!types(String, 123))
  test.ok(!types(String, true))
  test.ok(!types(String, {}))
  test.ok(!types(String, []))
  test.done()
}

suite['should validate Number'] = function (test) {
  test.ok(!types(Number, '123'))
  test.ok(!types(Number, undefined))
  test.ok(!types(Number, null))
  test.ok(types(Number, 123))
  test.ok(!types(Number, true))
  test.ok(!types(Number, {}))
  test.ok(!types(Number, []))
  test.done()
}

suite['should validate Boolean'] = function (test) {
  test.ok(!types(Boolean, '123'))
  test.ok(!types(Boolean, undefined))
  test.ok(!types(Boolean, null))
  test.ok(!types(Boolean, 123))
  test.ok(types(Boolean, true))
  test.ok(!types(Boolean, {}))
  test.ok(!types(Boolean, []))
  test.done()
}

suite['should validate Object'] = function (test) {
  test.ok(!types(Object, '123'))
  test.ok(!types(Object, undefined))
  test.ok(!types(Object, null))
  test.ok(!types(Object, 123))
  test.ok(!types(Object, true))
  test.ok(types(Object, {}))
  test.ok(!types(Object, []))
  test.done()
}

suite['should validate Array'] = function (test) {
  test.ok(!types(Array, '123'))
  test.ok(!types(Array, undefined))
  test.ok(!types(Array, null))
  test.ok(!types(Array, 123))
  test.ok(!types(Array, true))
  test.ok(!types(Array, {}))
  test.ok(types(Array, []))
  test.done()
}

suite['should validate null'] = function (test) {
  test.ok(types(null, null))
  test.ok(!types(null, undefined))
  test.ok(!types(null, 123))
  test.ok(!types(null, true))
  test.ok(!types(null, {}))
  test.ok(!types(null, []))
  test.done()
}

suite['should validate undefined'] = function (test) {
  test.ok(types(undefined, undefined))
  test.ok(!types(undefined, null))
  test.ok(!types(undefined, 123))
  test.ok(!types(undefined, true))
  test.ok(!types(undefined, {}))
  test.ok(!types(undefined, []))
  test.done()
}

suite['should validate with function'] = function (test) {
  test.ok(types(function (value) {
    test.equals(value, '123')
    return true
  }, '123'))
  test.ok(!types(function (value) {
    test.equals(value, '123')
    return false
  }, '123'))
  test.done()
}

suite['should handle falsy values'] = function (test) {
  test.ok(types(String, ''))
  test.ok(types(Boolean, false))
  test.ok(types(Number, 0))
  test.done()
}

module.exports = { types: suite }
