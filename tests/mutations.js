var Controller = require('./../src/index.js').Controller
var suite = {}

suite['should give correct path and value to mutation methods'] = function (test) {
  var Model = function (state) {
    return function (controller) {
      return {
        mutators: {
          set: function (path, value) {
            test.deepEqual(path, ['foo'])
            test.deepEqual(value, 'value')
          }
        }
      }
    }
  }
  var ctrl = Controller(Model({}))
  var signal = [
    function (args) {
      args.state.set('foo', 'value')
      args.state.set(['foo'], 'value')
    }
  ]

  ctrl.addSignals({
    'test': signal
  })
  ctrl.getSignals().test({}, {immediate: true})
  test.done()
}

suite['should be able to mutate with string'] = function (test) {
  var Model = function (state) {
    return function (controller) {
      return {
        mutators: {
          set: function (path, value) {
            test.deepEqual(path, ['foo', 'bar'])
          }
        }
      }
    }
  }
  var ctrl = Controller(Model({}))
  var signal = [
    function (args) {
      args.state.set('foo.bar', 'value')
    }
  ]

  ctrl.addSignals({
    'test': signal
  })
  ctrl.getSignals().test({}, {immediate: true})
  test.done()
}

module.exports = { mutations: suite }
