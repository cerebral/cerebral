var Controller = require('./../src/index.js')
var suite = {}
var async = function (cb) {
  setTimeout(cb, 0)
}
var Model = function (state) {
  state = state || {}
  return function () {
    return {
      accessors: {
        get: function (path) {
          return state[path[0]]
        }
      },
      mutators: {
        set: function (path, value) {
          state[path.pop()] = value
        }
      }
    }
  }
}

suite['should not affect payload'] = function (test) {
  var ctrl = Controller(Model())
  var payload = {foo: 'bar'}
  ctrl.addSignals({
    'test': [[
      function action (context) {
        context.output({bar: 'foo'})
      }
    ]]
  })
  ctrl.on('signalEnd', function (args) {
    test.deepEqual(args.signal.input, {foo: 'bar'})
    test.done()
  })
  ctrl.getSignals().test(payload)
}

suite['should register signals'] = function (test) {
  var ctrl = Controller(Model())
  ctrl.signals({
    'test': []
  })
  ctrl.addSignals({
    'test2': []
  })
  test.ok(typeof ctrl.getSignals().test === 'function')
  test.ok(typeof ctrl.getSignals().test2 === 'function')
  test.done()
}

suite['should return signals with getSignals method'] = function (test) {
  var ctrl = Controller(Model())

  ctrl.addSignals({
    'foo': [],
    'bar': [],
    'baz.foo': []
  })

  var signals = ctrl.getSignals()

  test.equal(typeof signals.foo, 'function')
  test.equal(typeof signals.bar, 'function')
  test.equal(typeof signals.baz.foo, 'function')

  test.equal(signals.foo, ctrl.getSignals('foo'))
  test.equal(signals.foo, ctrl.getSignals(['foo']))
  test.equal(signals.baz.foo, ctrl.getSignals('baz.foo'))
  test.equal(signals.baz.foo, ctrl.getSignals(['baz', 'foo']))

  test.done()
}

suite['should register sync signals'] = function (test) {
  test.expect(3)
  var run = 0
  var action = function () {
    run++
  }

  var ctrl = Controller(Model())
  ctrl.signalsSync({
    'test': []
  })
  ctrl.addSignals({
    'test2': {
      chain: [action],
      sync: true
    }
  })

  test.ok(typeof ctrl.getSignals().test === 'function')
  test.ok(typeof ctrl.getSignals().test2 === 'function')
  ctrl.getSignals().test2()
  test.equal(run, 1)

  test.done()
}

suite['should allow namespaced signals'] = function (test) {
  var ctrl = Controller(Model())
  ctrl.signals({
    'foo.bar': []
  })
  test.ok(typeof ctrl.getSignals().foo.bar === 'function')
  test.done()
}

suite['should trigger an action when run'] = function (test) {
  var ctrl = Controller(Model())
  ctrl.signals({
    'test': [
      function () {
        test.ok(true)
        test.done()
      }
    ]
  })
  ctrl.getSignals().test()
}

suite['should be able to define custom outputs as arrays'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output.foo({foo: 'bar'})
  }
  action.outputs = ['foo']
  var signal = [
    action, {
      foo: [
        function (args) {
          test.deepEqual(args.input, {foo: 'bar'})
          test.done()
        }
      ]
    }
  ]
  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should be able to define default custom path'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output({foo: 'bar'})
  }
  action.defaultOutput = 'bar'
  action.outputs = ['foo', 'bar']
  var signal = [
    action, {
      foo: [],
      bar: [
        function (args) {
          test.deepEqual(args.input, {foo: 'bar'})
          test.done()
        }
      ]
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should throw error if paths are missing'] = function (test) {
  var ctrl = Controller(Model())
  var action = function MyAction (args) {
    args.output({foo: 'bar'})
  }
  action.outputs = ['foo', 'bar']
  var signal = [
    action
  ]

  test.throws(function () {
    ctrl.signals({
      'test': signal
    })
  })
  test.done()
}

suite['should throw error if outputs as array does not match paths'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output({foo: 'bar'})
  }
  action.outputs = ['foo', 'bar']
  var signal = [
    action, {
      bar: []
    }
  ]
  test.throws(function () {
    ctrl.signals({
      'test': signal
    })
  })
  test.done()
}

suite['should throw error if outputs as object does not match paths'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output({foo: 'bar'})
  }
  action.outputs = {
    foo: true,
    bar: true
  }
  var signal = [
    action, {
      bar: []
    }
  ]
  test.throws(function () {
    ctrl.signals({
      'test': signal
    })
  })
  test.done()
}

suite['should throw error when output is missing'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output()
  }
  action.output = {
    foo: String
  }
  var signal = [
    action, function () {}
  ]

  ctrl.signals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should throw error when output type is wrong'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output({foo: false})
  }
  action.output = {
    foo: String
  }
  var signal = [
    action, function () {}
  ]
  ctrl.signals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should throw when calling next directly with no defaultOutput and outputs defined'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output({foo: 'bar'})
  }
  action.outputs = {
    foo: {
      bar: String
    }
  }
  var signal = [
    action, {
      foo: []
    }
  ]

  ctrl.signals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should run when output type is correct'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output({foo: 'bar'})
  }
  action.output = {
    foo: String
  }
  var signal = [
    action, function () {}
  ]

  ctrl.signals({
    'test': signal
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should run when outputs type is correct'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output.foo({bar: 'bar'})
  }
  action.outputs = {
    foo: {
      bar: String
    }
  }
  var signal = [
    action, {
      foo: []
    }
  ]

  ctrl.signals({
    'test': signal
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should pass initial payload on first argument'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      test.deepEqual(args.input, {foo: 'bar'})
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test({foo: 'bar'})
}

suite['should expose a output method to set new args'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      args.output({
        result: true
      })
    }, function (args) {
      test.ok(args.input.result)
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should be able to resolve as an async action'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    [
      function (args) {
        async(function () {
          args.output({
            result: true
          })
        })
      }
    ], function (args) {
      test.ok(args.input.result)
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should be able to define action as async'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    async(function () {
      args.output({
        result: true
      })
    })
  }
  action.async = true

  var signal = [
    action, function (args) {
      test.ok(args.input.result)
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should be able to define action as async with paths'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    async(function () {
      args.output.success({
        result: true
      })
    })
  }
  action.async = true

  var signal = [
    action, {
      success: [
        function (args) {
          test.ok(args.input.result)
          test.done()
        }
      ],
      error: []
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should trigger change event on individual async action paths'] = function (test) {
  var ctrl = Controller(Model())
  var changeCount = 0
  var signal = [
    [
      function (args) { args.output.success() }, {success: []},
      function (args) { args.output.success() }, {success: []}
    ],
    function () {
      test.equal(changeCount, 3)
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.on('change', function () {
    changeCount++
  })
  ctrl.getSignals().test()
}

suite['should be able to resolve to default path success'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      args.output.success({result: true})
    }, {
      'success': [
        function (args) {
          test.ok(args.input.result)
          test.done()
        }
      ]
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should be able to resolve to default path error'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      args.output.error({result: true})
    }, {
      'error': [
        function (args) {
          test.ok(args.input.result)
          test.done()
        }
      ]
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should be able to resolve to default as async action'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    [ function (args) {
      args.output.success({result: true})
    }, {
      'success': [
        function (args) {
          test.ok(args.input.result)
          test.done()
        }
      ]
    }]
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should expose mutation and a get method, if passed'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      test.ok(typeof args.state.get === 'function')
      test.ok(typeof args.state.set === 'function')
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should handle arrays of actions to run in parallell'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    [
      function (args) { args.output({ foo: true }) },
      function (args) { args.output({ bar: true }) }
    ],
    function (args) {
      test.deepEqual(args.input, {foo: true, bar: true})
      test.done()
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should handle arrays of actions to resolve to multiple paths'] = function (test) {
  var ctrl = Controller(Model())
  var results = []
  var signal = [
    [
      function (args) { args.output.success({ foo: true }) }, {
        'success': [
          function (args) { results.push(args.input) }
        ]
      },
      function (args) { args.output.error({ bar: true }) }, {
        'error': [
          function (args) { results.push(args.input) }
        ]
      }
    ]
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
  // async trigger of signal
  async(function () {
    // async signals resolve
    async(function () {
      test.equals(results.length, 2)
      test.deepEqual(results[0], {
        foo: true,
        bar: true
      })
      test.done()
    })
  })
}

suite['should trigger paths when individual async is done'] = function (test) {
  var ctrl = Controller(Model())
  var results = []
  var signal = [
    [
      function (args) {
        async(function () { args.output.success({ value: 'foo' }) })
      }, {
        'success': [
          function (args) { results.push(args.input.value) }
        ]
      },
      function (args) { args.output.error({ value: 'bar' }) }, {
        'error': [
          function (args) { results.push(args.input.value) }
        ]
      }
    ]
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.once('signalEnd', function () {
    test.equal(results[0], 'bar')
    test.equal(results[1], 'foo')
    test.done()
  })
  ctrl.getSignals().test()
}

suite['should wait to resolve top level async array when nested async arrays are running'] = function (test) {
  var ctrl = Controller(Model())
  var results = []
  var signal = [
    [
      function (args) {
        async(function () {
          args.output.success({
            value: 'foo'
          })
        })
      }, {
        'success': [
          [
            function (args) {
              results.push(args.input.value)
              args.output()
            }
          ]
        ]
      }
    ], function () {
      results.push('bar')
    }
  ]
  ctrl.signals({
    'test': signal
  })
  ctrl.once('signalEnd', function () {
    test.equal(results[0], 'foo')
    test.equal(results[1], 'bar')
    test.done()
  })
  ctrl.getSignals().test()
}

suite['should throw error when trying to mutate with an async action'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    [ function (args) {
      test.throws(function () {
        args.state.set('foo', 'bar')
      })
      test.done()
    }]
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should allow services'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      test.ok(args.services.foo)
      test.done()
    }
  ]

  ctrl.services({
    foo: function () {

    }
  })

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should trigger signal synchronously when using sync method'] = function (test) {
  var ctrl = Controller(Model())
  var hasRun = false
  var signal = [
    function () {
      hasRun = true
    }
  ]

  ctrl.signals({
    'test': signal
  })
  ctrl.getSignals().test.sync()
  test.ok(hasRun)
  test.done()
}

suite['should trigger signal synchronously when defined as signalSync'] = function (test) {
  var ctrl = Controller(Model())
  var hasRun = false
  var signal = [
    function () {
      hasRun = true
    }
  ]

  ctrl.signalsSync({
    'test': signal
  })
  ctrl.getSignals().test()
  test.ok(hasRun)
  test.done()
}

suite['should throw error when input is defined on action and value is missing or is wrong type'] = function (test) {
  var ctrl = Controller(Model())
  var action = function () {}
  action.input = {
    foo: String
  }
  var signal = [
    function (args) {
      args.output()
    }, action
  ]

  ctrl.signals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should run signal without any actions'] = function (test) {
  var ctrl = Controller(Model())

  ctrl.signals({
    'test': []
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test.sync()
  })
  test.done()
}

suite['should allow actions to have default input'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    test.equal(args.input.foo, 'bar')
  }
  action.defaultInput = {
    foo: 'bar'
  }
  var signal = [action]

  ctrl.signals({
    'test': signal
  })
  test.expect(1)
  ctrl.getSignals().test.sync()
  test.done()
}

suite['should allow ASYNC actions to have default input'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    test.equal(args.input.foo, 'bar')
    args.output()
  }
  action.defaultInput = {
    foo: 'bar'
  }
  var signal = [
    [
      action
    ]
  ]

  ctrl.signals({
    'test': signal
  })
  test.expect(1)
  ctrl.once('signalEnd', function () {
    test.done()
  })
  ctrl.getSignals().test()
}

suite['should throw error when output path is not an array'] = function (test) {
  var ctrl = Controller(Model())
  var action = function (args) {
    args.output.success()
  }
  var signal = [
    [
      action, {
        success: function () {}
      }
    ]
  ]
  test.throws(function () {
    ctrl.signals({
      'test': signal
    })
  })
  test.done()
}

suite['should emit events in correct order'] = function (test) {
  var ctrl = Controller(Model())
  var i = 0
  var signal = [
    function () {},
    [
      function (args) { setTimeout(args.output, 30) },
      function (args) { setTimeout(args.output, 10) }
    ], [
      function (args) { setTimeout(args.output, 10) }
    ]
  ]

  ctrl.signals({
    'test': signal
  })

  ctrl.on('signalStart', function (args) {
    test.equal(i, 0)
    test.ok(args.signal.isExecuting)
    i++
  })
  ctrl.on('actionStart', function (args) {
    var action = args.action
    switch (i) {
      case 1:
        test.equal(action.actionIndex, 0)
        break
      case 3:
        test.equal(action.actionIndex, 1)
        break
      case 4:
        test.equal(action.actionIndex, 2)
        break
      case 7:
        test.equal(action.actionIndex, 3)
        break
    }
    i++
  })
  ctrl.on('actionEnd', function (args) {
    var action = args.action
    switch (i) {
      case 2:
        test.equal(action.actionIndex, 0)
        break
      case 5:
        test.equal(action.actionIndex, 2)
        break
      case 6:
        test.equal(action.actionIndex, 1)
        break
      case 8:
        test.equal(action.actionIndex, 3)
        break
    }
    i++
  })
  ctrl.on('signalEnd', function (args) {
    test.equal(i, 9)
    test.ok(!args.signal.isExecuting)
    test.done()
  })

  ctrl.getSignals().test()
}

suite['should not run signal if prevented'] = function (test) {
  var ctrl = Controller(Model())
  var signal = [
    function () { test.ok(false) }
  ]

  ctrl.signals({
    'test': signal
  })

  ctrl.on('signalTrigger', function (args) {
    args.signal.preventSignalRun()
    test.ok(args.signal.isPrevented)
    test.ok(!args.signal.isExecuting)
    test.done()
  })

  ctrl.on('signalStart', function () {
    test.ok(false)
  })

  ctrl.getSignals().test()
}

suite['should attach error when failed action execution'] = function (test) {
  var ctrl = Controller(Model())
  var testObject = {}
  var signal = [
    function () { testObject.unknown.property }
  ]

  ctrl.signals({
    'test': signal
  })

  test.throws(function () {
    ctrl.on('signalError', function (args) {
      test.equal(args.action.error.name, 'TypeError')
      test.done()
    })
    ctrl.getSignals().test.sync()
  })
}

suite['should wrap and track use of services'] = function (test) {
  var ctrl = Controller(Model())

  var ModuleA = function (module) {
    function NoPrototype () {

    }

    NoPrototype.prototype = null

    var action = function (args) {
      args.module.services.test('foo')
      args.module.services.noPrototype('foo')
    }

    module.addServices({
      test: function () {

      },
      noPrototype: NoPrototype
    })

    module.addSignals({
      test: [action]
    })
  }

  var ModuleB = function (module) {
    var action = function (args) {
      args.module.services.test('foo')
    }

    module.addServices({
      test: function () {

      }
    })

    module.addSignals({
      test: [action]
    })

    module.addModules({
      moduleC: ModuleC
    })
  }

  var ModuleC = function (module) {
    var action = function (args) {
      args.module.services.test('foo')
      args.module.services.test2.foo('foo')
      args.module.services.test2.bar('foo')
    }

    module.addServices({
      test: function () {

      },
      test2: {
        foo: function () {

        },
        bar: function () {

        },
        string: 'hey',
        array: []
      }
    })

    module.addSignals({
      test: [action]
    })
  }

  var ModuleD = function (module) {
    module.addServices({
      emitter: require('events').EventEmitter
    })
  }

  ctrl.addModules({
    moduleA: ModuleA,
    moduleB: ModuleB,
    moduleD: ModuleD
  })

  var assertModuleA = function (args) {
    test.ok(ctrl.getServices().moduleA.test)
    test.ok(ctrl.getServices().moduleA.noPrototype)
    test.equal(args.signal.branches[0].serviceCalls[0].name, 'moduleA')
    test.equal(args.signal.branches[0].serviceCalls[0].method, 'test')
    test.deepEqual(args.signal.branches[0].serviceCalls[0].args, ['foo'])
    test.equal(args.signal.branches[0].serviceCalls[1].name, 'moduleA')
    test.equal(args.signal.branches[0].serviceCalls[1].method, 'noPrototype')
    test.deepEqual(args.signal.branches[0].serviceCalls[1].args, ['foo'])
  }
  ctrl.on('signalEnd', assertModuleA)
  ctrl.getSignals().moduleA.test.sync()
  ctrl.removeListener('signalEnd', assertModuleA)

  var assertModuleB = function (args) {
    test.ok(ctrl.getServices().moduleB.test)
    test.equal(args.signal.branches[0].serviceCalls[0].name, 'moduleB')
    test.equal(args.signal.branches[0].serviceCalls[0].method, 'test')
    test.deepEqual(args.signal.branches[0].serviceCalls[0].args, ['foo'])
  }
  ctrl.on('signalEnd', assertModuleB)
  ctrl.getSignals().moduleB.test.sync()
  ctrl.removeListener('signalEnd', assertModuleB)

  var assertModuleC = function (args) {
    test.ok(ctrl.getServices().moduleB.moduleC.test)
    test.ok(ctrl.getServices().moduleB.moduleC.test2)
    test.equal(ctrl.getServices().moduleB.moduleC.test2.string, 'hey')
    test.deepEqual(ctrl.getServices().moduleB.moduleC.test2.array, [])

    test.equal(args.signal.branches[0].serviceCalls[0].name, 'moduleB.moduleC')
    test.equal(args.signal.branches[0].serviceCalls[0].method, 'test')
    test.deepEqual(args.signal.branches[0].serviceCalls[0].args, ['foo'])
  }
  ctrl.on('signalEnd', assertModuleC)
  ctrl.getSignals().moduleB.moduleC.test.sync()
  ctrl.removeListener('signalEnd', assertModuleC)

  test.done()
}

suite['should NOT wrap and track use of special or nested services'] = function (test) {
  var ctrl = Controller(Model())
  function MyClass () {

  }
  MyClass.prototype = {
    constructor: MyClass
  }

  function Extended () {

  }
  Extended.foo = 'bar'

  var moduleA = function (module) {
    module.addServices({
      MyClass: MyClass,
      nested: {
        foo: function () {

        },
        MyClass: MyClass,
        extended: Extended
      },
      extended: Extended
    })
  }

  var action = function (args) {
    args.services.moduleA.MyClass()
    args.services.moduleA.extended()
    args.services.moduleA.nested.foo()
    args.services.moduleA.nested.MyClass()
    args.services.moduleA.nested.extended()
  }

  ctrl.addSignals({
    signal: [action]
  })

  ctrl.addModules({
    moduleA: moduleA
  })

  var assertNoServicesWrapped = function (args) {
    test.ok(!args.signal.branches[0].serviceCalls.length)
    test.done()
  }
  ctrl.on('signalEnd', assertNoServicesWrapped)
  ctrl.getSignals().signal.sync()
}

suite['should expose an isExecuting method'] = function (test) {
  var ctrl = Controller(Model())
  test.equal(ctrl.isExecuting(), false)
  test.done()
}

suite['should return true on isExecuting when executing signals'] = function (test) {
  test.expect(2)
  var ctrl = Controller(Model())
  var signal = [
    function (args) {
      test.equal(ctrl.isExecuting(), true)
    }
  ]

  ctrl.addSignals({
    'test': signal
  })
  ctrl.getSignals().test.sync()
  test.equal(ctrl.isExecuting(), false)
  test.done()
}

suite['should handle multiple signals in same execution'] = function (test) {
  test.expect(4)
  var ctrl = Controller(Model())
  var signal = [
    function () {

    }
  ]
  var signalAsync = [
    [
      function (args) {
        args.output()
      }
    ]
  ]

  ctrl.addSignals({
    'test': signal,
    'testAsync': signalAsync
  })
  ctrl.getSignals().testAsync.sync()
  test.equal(ctrl.isExecuting(), true)
  ctrl.getSignals().test.sync()
  test.equal(ctrl.isExecuting(), true)
  ctrl.getSignals().test.sync()
  test.equal(ctrl.isExecuting(), true)
  async(function () {
    test.equal(ctrl.isExecuting(), false)
    test.done()
  })
}

module.exports = { signals: suite }
