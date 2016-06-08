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

suite['should not affect initial payload'] = function (test) {
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
    test.deepEqual(args.payload, {foo: 'bar', bar: 'foo'})
    test.done()
  })
  ctrl.getSignals().test(payload)
}

suite['should bring outputs down paths back up'] = function (test) {
  var ctrl = Controller(Model())
  var payload = {foo: 'bar'}
  ctrl.addSignals({
    'test': [[
      function action (context) {
        context.output.success({bar: 'foo'})
      }, {
        success: [
          function success (context) {
            context.output({mip: 'mop'})
          }
        ]
      }
    ], function afterAsync (context) {
      test.deepEqual(context.input, {
        foo: 'bar',
        bar: 'foo',
        mip: 'mop'
      })
      test.done()
    }]
  })
  ctrl.getSignals().test(payload)
}

suite['should bring outputs down paths back up on synchronous nesting'] = function (test) {
  var ctrl = Controller(Model())

  var ac1 = function ac1 (context) {
    context.output.success({foo: 'bar'})
  }
  ac1.outputs = ['success']
  var ac2 = function ac2 (context) {
    context.output.success({bar: 'foo'})
  }
  ac2.outputs = ['success']
  ctrl.addSignals({
    'test': [
      ac1, {
        success: [
          ac2, {
            success: []
          }
        ]
      },
      function hm (context) {
        test.deepEqual(context.input, {foo: 'bar', bar: 'foo'})
        test.done()
      }
    ]
  })
  ctrl.getSignals().test({}, {immediate: true})
}

suite['should override payload properties propagated up the signal tree async'] = function (test) {
  var ctrl = Controller(Model())

  var ac1 = function ac1 (context) {
    context.output.success({foo: 'bar'})
  }
  ac1.async = true
  ac1.outputs = ['success']
  var ac2 = function ac2 (context) {
    context.output.success({foo: 'bar2'})
  }
  ac2.async = true
  ac2.outputs = ['success']
  ctrl.addSignals({
    'test': [
      ac1, {
        success: [
          ac2, {
            success: []
          }
        ]
      },
      function hm (context) {
        test.deepEqual(context.input, {foo: 'bar2'})
        test.done()
      }
    ]
  })
  ctrl.getSignals().test({}, {immediate: true})
}

suite['should handle async and sync actions outputting payload and propagating up the tree'] = function (test) {
  var ctrl = Controller(Model())

  var ac1 = function ac1 (context) {
    context.output.success({foo: 'bar'})
  }
  ac1.async = true
  ac1.outputs = ['success']
  var ac2 = function ac2 (context) {
    context.output({foo: 'bar2'})
  }
  var ac3 = function ac3 (context) {
    context.output({foo: 'bar3'})
  }
  ac3.async = true
  ctrl.addSignals({
    'test': [
      ac1, {
        success: [
          ac2,
          ac3
        ]
      },
      function hm (context) {
        test.deepEqual(context.input, {foo: 'bar3'})
        test.done()
      }
    ]
  })
  ctrl.getSignals().test({}, {immediate: true})
}

suite['should override payload properties propagated up the signal tree sync'] = function (test) {
  var ctrl = Controller(Model())

  var ac1 = function ac1 (context) {
    context.output.success({foo: 'bar'})
  }
  ac1.outputs = ['success']
  var ac2 = function ac2 (context) {
    context.output.success({foo: 'bar2'})
  }
  ac2.outputs = ['success']
  ctrl.addSignals({
    'test': [
      ac1, {
        success: [
          ac2, {
            success: []
          }
        ]
      },
      function hm (context) {
        test.deepEqual(context.input, {foo: 'bar2'})
        test.done()
      }
    ]
  })
  ctrl.getSignals().test({}, {immediate: true})
}

suite['should bring outputs down paths back up on synchronous nesting even with no output'] = function (test) {
  var ctrl = Controller(Model())

  var ac1 = function ac1 (context) {
    context.output.success()
  }
  ac1.outputs = ['success']
  var ac2 = function ac2 (context) {
    context.output.success({bar: 'foo'})
  }
  ac2.outputs = ['success']
  ctrl.addSignals({
    'test': [
      ac1, {
        success: [
          ac2, {
            success: []
          }
        ]
      },
      function hm (context) {
        test.deepEqual(context.input, {foo: 'bar', bar: 'foo'})
        test.done()
      }
    ]
  })
  ctrl.getSignals().test({foo: 'bar'}, {immediate: true})
}

suite['should bring outputs down paths back up on synchronous nesting even with plain output'] = function (test) {
  var ctrl = Controller(Model())

  var ac1 = function ac1 (context) {
    context.output.success()
  }
  ac1.outputs = ['success']
  var ac2 = function ac2 (context) {
    context.output({bar: 'foo'})
  }
  ctrl.addSignals({
    'test': [
      ac1, {
        success: [
          ac2
        ]
      },
      function hm (context) {
        test.deepEqual(context.input, {foo: 'bar', bar: 'foo'})
        test.done()
      }
    ]
  })
  try {
    ctrl.getSignals().test({foo: 'bar'}, {immediate: true})
  } catch (e) {
    console.log(e.stack)
  }
}

suite['should register signals'] = function (test) {
  var ctrl = Controller(Model())
  ctrl.addSignals({
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
  ctrl.addSignals({
    'test': [],
    'test2': {
      chain: [action],
      immediate: true
    }
  })

  test.ok(typeof ctrl.getSignals().test === 'function')
  test.ok(typeof ctrl.getSignals().test2 === 'function')
  ctrl.getSignals().test2()
  test.equal(run, 1)

  test.done()
}

suite['should handle local and global options'] = function (test) {
  var run = 0
  var immediate = 0

  var ctrl = Controller(Model())
  ctrl.addSignals({
    'test': [],
    'test2': {
      chain: [],
      immediate: true,
      global: false
    },
    'test3': []
  })

  ctrl.on('signalStart', function (event) {
    run++

    if (event.signal.isSync === true) immediate++

    if (run === 3) {
      test.equal(immediate, 1)
      test.done()
    }
  })

  ctrl.getSignals().test()
  ctrl.getSignals().test2()
  ctrl.getSignals().test3()
}

suite['should allow namespaced signals'] = function (test) {
  var ctrl = Controller(Model())
  ctrl.addSignals({
    'foo.bar': []
  })
  test.ok(typeof ctrl.getSignals().foo.bar === 'function')
  test.done()
}

suite['should trigger an action when run'] = function (test) {
  var ctrl = Controller(Model())
  ctrl.addSignals({
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
  ctrl.addSignals({
    'test': {
      chain: signal,
      immediate: true
    }
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

  ctrl.addSignals({
    'test': {
      chain: signal,
      immediate: true
    }
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
    ctrl.addSignals({
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
    ctrl.addSignals({
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
    ctrl.addSignals({
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

  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
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
  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
    'test': signal
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
    'test': signal
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
    'test': signal
  })
  ctrl.getSignals().test()
}

suite['should trigger change event on individual async action paths, but not on the last'] = function (test) {
  var ctrl = Controller(Model())
  var changeCount = 0
  var signal = [
    [
      function (args) { args.output.success() }, {success: []},
      function (args) { args.output.success() }, {success: []}
    ],
    function () {
      test.equal(changeCount, 2)
      test.done()
    }
  ]

  ctrl.addSignals({
    'test': {
      chain: signal,
      immediate: true
    }
  })
  ctrl.on('change', function () {
    changeCount++
  })
  try {
    ctrl.getSignals().test()
  } catch (e) {
    console.log(e)
  }
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addSignals({
    'test': signal
  })
  ctrl.getSignals().test()
  // async trigger of signal
  async(function () {
    // async signals resolve
    async(function () {
      test.equals(results.length, 2)
      test.deepEqual(results[0], {
        foo: true
      })
      test.deepEqual(results[1], {
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

  ctrl.addSignals({
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
  ctrl.addSignals({
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

  ctrl.addSignals({
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

  ctrl.addServices({
    foo: function () {

    }
  })

  ctrl.addSignals({
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

  ctrl.addSignals({
    'test': signal
  })
  ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
    'test': {
      chain: signal,
      immediate: true
    }
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

  ctrl.addSignals({
    'test': signal
  })
  test.throws(function () {
    ctrl.getSignals().test({}, {immediate: true})
  })
  test.done()
}

suite['should run signal without any actions'] = function (test) {
  var ctrl = Controller(Model())

  ctrl.addSignals({
    'test': []
  })
  test.doesNotThrow(function () {
    ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
    'test': signal
  })
  test.expect(1)
  ctrl.getSignals().test({}, {immediate: true})
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

  ctrl.addSignals({
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
    ctrl.addSignals({
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
    ],
    function (args) {
      args.output.foo()
    }, {
      foo: [ function () {} ]
    }
  ]

  ctrl.addSignals({
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
      case 9:
        test.equal(action.actionIndex, 4)
        break
      case 11:
        test.equal(action.actionIndex, 5)
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
      case 10:
        test.equal(action.actionIndex, 4)
        test.equal(action.outputPath, 'foo')
        break
      case 12:
        test.equal(action.actionIndex, 5)
        break
    }
    i++
  })
  ctrl.on('signalEnd', function (args) {
    test.equal(i, 13)
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

  ctrl.addSignals({
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

  ctrl.addSignals({
    'test': signal
  })

  test.throws(function () {
    ctrl.on('signalError', function (args) {
      test.equal(args.action.error.name, 'TypeError')
      test.done()
    })
    ctrl.getSignals().test({}, {immediate: true})
  })
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
  ctrl.getSignals().test({}, {immediate: true})
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
  ctrl.getSignals().testAsync({}, {immediate: true})
  test.equal(ctrl.isExecuting(), true)
  ctrl.getSignals().test({}, {immediate: true})
  test.equal(ctrl.isExecuting(), true)
  ctrl.getSignals().test({}, {immediate: true})
  test.equal(ctrl.isExecuting(), true)
  async(function () {
    test.equal(ctrl.isExecuting(), false)
    test.done()
  })
}

suite['should emit options passed to events'] = function (test) {
  var ctrl = Controller(Model())
  var testOptions = function (args) {
    test.equal(args.options.foo, 'bar')
    test.equal(args.options.immediate, true)
    test.deepEqual(args.options.context, {})
  }
  ctrl.addSignals({
    'test': {
      chain: [[
        function action () {

        }
      ]],
      immediate: true,
      context: {},
      foo: 'bar'
    }
  })
  ctrl.on('change', testOptions)
  ctrl.on('signalStart', testOptions)
  ctrl.on('signalEnd', testOptions)
  ctrl.on('actionStart', testOptions)
  ctrl.on('actionEnd', testOptions)
  ctrl.getSignals().test()
  test.done()
}

suite['should emit payload passed to events'] = function (test) {
  test.expect(5)
  var ctrl = Controller(Model())
  var testOptions = function (args) {
    test.equal(args.payload.foo, 'bar')
  }
  ctrl.addSignals({
    'test': {
      chain: [
        function action () {

        }
      ],
      immediate: true
    }
  })
  ctrl.on('change', testOptions)
  ctrl.on('signalStart', testOptions)
  ctrl.on('signalEnd', testOptions)
  ctrl.on('actionStart', testOptions)
  ctrl.on('actionEnd', testOptions)
  ctrl.getSignals().test({foo: 'bar'})
  test.done()
}

suite['should be able to add external context providers'] = function (test) {
  test.expect(1)
  var ctrl = Controller(Model())
  ctrl.addSignals({
    'test': {
      chain: [
        function action (context) {
          test.equal(context.foo, 'bar')
        }
      ],
      immediate: true
    }
  })
  ctrl.addContextProvider(function (context) {
    return Object.keys(context).reduce(function (newContext, key) {
      newContext[key] = context[key]
      return newContext
    }, {
      foo: 'bar'
    })
  })
  ctrl.getSignals().test()
  test.done()
}

suite['should be able to add context provider for a specific module'] = function (test) {
  test.expect(4)
  var ctrl = Controller(Model())
  var TestModule = function (module) {
    module.addSignals({
      'test': {
        chain: [
          function action (context) {
            test.equal(context.foo, 'bar')
            test.ok(context.isModule)
          }
        ],
        immediate: true
      }
    })
    module.addContextProvider(function (context) {
      return Object.keys(context).reduce(function (newContext, key) {
        newContext[key] = context[key]
        return newContext
      }, {
        foo: 'bar',
        isModule: true
      })
    })
  }
  ctrl.addSignals({
    'test': {
      chain: [
        function action (context) {
          test.equal(context.foo, 'bar')
          test.ok(!context.isModule)
        }
      ],
      immediate: true
    }
  })
  ctrl.addContextProvider(function (context) {
    return Object.keys(context).reduce(function (newContext, key) {
      newContext[key] = context[key]
      return newContext
    }, {
      foo: 'bar'
    })
  })
  ctrl.addModules({test: TestModule})
  ctrl.getSignals().test()
  ctrl.getSignals().test.test()
  test.done()
}

suite['should only run unique context providers'] = function (test) {
  test.expect(2)
  var ctrl = Controller(Model())
  var contextProvider = function (context) {
    test.ok(true)
    return Object.keys(context).reduce(function (newContext, key) {
      newContext[key] = context[key]
      return newContext
    }, {
      foo: 'bar'
    })
  }
  ctrl.addSignals({
    'test': {
      chain: [
        function action (context) {
          test.equal(context.foo, 'bar')
        }
      ],
      immediate: true
    }
  })
  ctrl.addContextProvider(contextProvider)
  ctrl.addContextProvider(contextProvider)
  ctrl.getSignals().test()
  test.done()
}

suite['should expose execution details to context callback'] = function (test) {
  test.expect(7)
  var ctrl = Controller(Model())
  var ModuleA = function (module) {
    module.addSignals({
      'test': {
        chain: [
          function action () {

          }
        ],
        immediate: true
      }
    })
  }
  ctrl.addContextProvider(function (context, execution) {
    test.ok(execution.action)
    test.ok(execution.signal)
    test.ok(execution.options)
    test.ok(execution.payload)
    test.equal(execution.payload.foo, 'bar')
    test.ok(execution.options.immediate)
    test.equal(execution.options.modulePath, 'moduleA')
    return context
  })
  ctrl.addModules({
    moduleA: ModuleA
  })
  ctrl.getSignals().moduleA.test({
    foo: 'bar'
  })
  test.done()
}

suite['should fire change event when updating from running parallel async actions'] = function (test) {
  test.expect(2)
  var changeCount = 0
  var ctrl = Controller(Model({
    foo: false
  }))
  var ModuleA = function (module) {
    module.addSignals({
      'test': [
        [
          function actionA (context) {
            setTimeout(function () {
              if (context.state.get(['foo'])) {
                context.output.success()
              } else {
                context.output.error()
              }
            }, 100)
          }, {
            success: [],
            error: [
              function actionASet (context) {
                context.state.set(['bar'], true)
              }
            ]
          },
          function actionB (context) {
            setTimeout(function () {
              context.output.success()
            }, 200)
          }, {
            success: [
              function actionBSet (context) {
                context.state.set(['foo'], true)
              }
            ],
            error: []
          }
        ]
      ]
    })
  }

  ctrl.addModules({
    moduleA: ModuleA
  })
  ctrl.on('signalEnd', function () {
    test.equals(changeCount, 2)
    test.done()
  })
  ctrl.on('change', function () {
    changeCount++
    if (changeCount === 2) {
      test.ok(ctrl.get(['bar']))
    }
  })
  ctrl.getSignals().moduleA.test({
    foo: 'bar'
  })
}

module.exports = { signals: suite }
