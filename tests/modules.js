var Controller = require('./../src/index.js').Controller
var suite = {}

var Model = function (initialState) {
  var state = initialState
  return function () {
    return {
      accessors: {
        get: function () {
          return state
        }
      },
      mutators: {
        set: function (path, value) {
          var traverseState = state
          path = path.slice()
          var setKey = path.pop()
          while (path.length) {
            var key = path.shift()
            traverseState = traverseState[key] = traverseState[key] || {}
          }
          traverseState[setKey] = value
        }
      }
    }
  }
}

suite['should be able to register a module'] = function (test) {
  var ctrl = Controller(Model({}))
  ctrl.addModules({
    test: function () {}
  })
  ctrl.addModules({
    test2: function () {}
  })

  test.ok(ctrl.getModules().test)
  test.ok(ctrl.getModules().test2)
  test.done()
}

suite['should pass the module and controller, and expose module name and path on controller'] = function (test) {
  var ctrl = Controller(Model({}))
  test.expect(5)
  ctrl.addModules({
    test: function (module, controller) {
      test.equal(controller, ctrl)
      test.equal(module.name, 'test')
      test.equal(typeof module.getSignals, 'function')
    }
  })
  test.equal(ctrl.getModules().test.name, 'test')
  test.deepEqual(ctrl.getModules().test.path, ['test'])
  test.done()
}

suite['should be able to add a signal'] = function (test) {
  var ctrl = Controller(Model({}))
  ctrl.addModules({
    test: function (module) {
      module.addSignals({
        'test': [],
        'test2': {
          chain: [],
          immediate: true
        }
      })
    }
  })
  test.ok(ctrl.getSignals().test.test)
  test.ok(ctrl.getSignals().test.test2)
  test.done()
}

suite['should be able to add a service'] = function (test) {
  var ctrl = Controller(Model({}))
  ctrl.addModules({
    test: function (module) {
      module.addServices({
        'test': {}
      })
    }
  })
  test.ok(ctrl.getServices().test.test)
  test.done()
}

suite['should be able to add namespaced state'] = function (test) {
  var ctrl = Controller(Model({}))
  test.expect(1)
  ctrl.addModules({
    test: function (module) {
      module.addState({
        foo: 'bar'
      })
    }
  })
  test.deepEqual(ctrl.get(), {test: {foo: 'bar'}})
  test.done()
}

suite['should be able to add an alias'] = function (test) {
  var ctrl = Controller(Model({}))
  test.expect(2)
  ctrl.addModules({
    test: function (module) {
      module.alias('cerebral-module-test')
    }
  })
  test.ok(ctrl.getModules()['cerebral-module-test'])
  test.ok(ctrl.getModules().test)
  test.done()
}

suite['should be able to add a submodule with namespaced state, signals and services'] = function (test) {
  var ctrl = Controller(Model({}))
  test.expect(1)
  ctrl.addModules({
    test: function (module) {
      module.addModules({
        sub: function (module) {
          module.addSignals({
            'test': [
              function action (arg) {
                test.deepEqual(arg.state.get(), { test: { sub: { foo: 'bar' } } })
              }
            ]
          })
          module.addServices({
            'test': {}
          })
          module.addState({foo: 'bar'})
        }
      })
    }
  })

  ctrl.getSignals().test.sub.test({}, {immediate: true})
  test.done()
}

suite['should expose signals added to module on the module object'] = function (test) {
  var ctrl = Controller(Model({}))
  test.expect(1)
  ctrl.addModules({
    test: function (module) {
      module.addModules({
        sub: function (module) {
          module.addSignals({
            'test': [
              function action (arg) {
                test.ok(module.getSignals().test)
              }
            ]
          })
        }
      })
    }
  })
  ctrl.getSignals().test.sub.test({}, {immediate: true})
  test.done()
}

suite['should expose meta information returned'] = function (test) {
  var ctrl = Controller(Model({}))
  test.expect(1)
  ctrl.addModules({
    test: function (module) {
      return {
        foo: 'bar'
      }
    }
  })
  test.equal(ctrl.getModules().test.meta.foo, 'bar')
  test.done()
}

suite['should return modules with getModules method'] = function (test) {
  var ctrl = Controller(Model({}))

  ctrl.addModules({
    foo: function (module) {
      module.addModules({ bar: function (module) {
        module.alias('baz')
      } })
    }
  })

  var modules = ctrl.getModules()

  test.equal(modules.foo, ctrl.getModules('foo'))
  test.equal(modules['foo.bar'], ctrl.getModules('foo.bar'))
  test.equal(modules['foo.bar'], modules.baz)
  test.equal(modules.baz, ctrl.getModules('baz'))
  test.done()
}

suite['should throw error if signals are triggered when instantiating'] = function (test) {
  test.expect(1)
  var ctrl = Controller(Model({}))

  ctrl.addSignals({
    test: []
  })
  test.throws(function () {
    ctrl.addModules({
      foo: function (module, controller) {
        controller.getSignals().test()
      }
    })
  })
  test.done()
}

module.exports = { modules: suite }
