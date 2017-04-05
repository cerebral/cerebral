/* eslint-env mocha */
import FunctionTree, {sequence, parallel, FunctionTreeExecutionError} from './'
import assert from 'assert'

describe('FunctionTree', () => {
  it('should create a function tree extending event emitter', () => {
    const ft = new FunctionTree([])

    assert.equal(typeof ft.on, 'function')
    assert.equal(typeof ft.once, 'function')
    assert.equal(typeof ft.off, 'function')
  })
  it('should run functions', () => {
    const ft = new FunctionTree()

    ft.run([
      () => {
        assert.ok(true)
      }
    ])
  })
  it('should run sequences', () => {
    const ft = new FunctionTree()

    ft.run(sequence([
      () => {
        assert.ok(true)
      }
    ]))
  })
  it('should set name of execution based on explicit, sequence name or id', () => {
    const ft = new FunctionTree()

    ft.run([
      ({execution}) => {
        assert.ok(execution.name)
      }
    ])
    ft.run('foo', [
      ({execution}) => {
        assert.equal(execution.name, 'foo')
      }
    ])
    ft.run(sequence('bar', [
      ({execution}) => {
        assert.equal(execution.name, 'bar')
      }
    ]))
  })
  it('should pass arguments to context creator and run it for each action', () => {
    const ft = new FunctionTree([
      function SomeProvider (context, functionDetails, payload, prevPayload) {
        assert.ok(context)
        assert.equal(functionDetails.functionIndex, 0)
        assert.deepEqual(payload, {foo: 'bar'})
        assert.equal(prevPayload, null)

        return context
      }
    ])

    ft.run([
      () => {}
    ], {
      foo: 'bar'
    })
  })
  it('should pass previous payload to context provider', () => {
    const ft = new FunctionTree([
      function SomeProvider (context, functionDetails, payload, prevPayload) {
        if (functionDetails.functionIndex === 0) {
          assert.deepEqual(payload, {foo: 'bar'})
          assert.equal(prevPayload, null)
        } else {
          assert.deepEqual(payload, {foo: 'bar2'})
          assert.deepEqual(prevPayload, {foo: 'bar'})
        }

        return context
      }
    ])

    ft.run([
      () => ({foo: 'bar2'}),
      () => {}
    ], {
      foo: 'bar'
    })
  })
  it('should pass returned context into functions', () => {
    const ft = new FunctionTree([
      function SomeProvider (context) {
        context.foo = 'bar'

        return context
      }
    ])

    ft.run([
      ({foo}) => {
        assert.equal(foo, 'bar')
      }
    ])
  })
  it('should emit execution events in correct order', () => {
    let eventsCount = 0
    const ft = new FunctionTree()

    ft.once('start', function () {
      eventsCount++
      assert.equal(eventsCount, 1)
    })
    ft.once('functionStart', function () {
      eventsCount++
      assert.equal(eventsCount, 2)
      ft.once('functionStart', function () {
        eventsCount++
        assert.equal(eventsCount, 4)
      })
    })
    ft.once('functionEnd', function () {
      eventsCount++
      assert.equal(eventsCount, 3)
      ft.once('functionEnd', function () {
        eventsCount++
        assert.equal(eventsCount, 5)
      })
    })
    ft.on('end', function () {
      eventsCount++
      assert.equal(eventsCount, 6)
    })
    ft.run([
      function actionA () {},
      function actionB () {}
    ])
  })
  it('should pass action and payload on action events', () => {
    const ft = new FunctionTree()

    ft.once('functionStart', function (execution, functionDetails, payload) {
      assert.ok(execution.id)
      assert.equal(functionDetails.functionIndex, 0)
      assert.deepEqual(payload, {foo: 'bar'})
    })
    ft.once('functionEnd', function (execution, functionDetails, payload) {
      assert.ok(execution.id)
      assert.equal(functionDetails.functionIndex, 0)
      assert.deepEqual(payload, {foo: 'bar'})
    })
    ft.run([
      () => {}
    ], {
      foo: 'bar'
    })
  })
  it('should indicate parallel execution on function', () => {
    const ft = new FunctionTree()

    ft.once('functionStart', function (execution, functionDetails) {
      assert.ok(true)
    })
    ft.run([
      parallel([
        () => {},
        () => {}
      ])
    ])
  })
  it('should pass final payload on end event', () => {
    const ft = new FunctionTree()
    ft.once('end', (execution, payload) => {
      assert.deepEqual(payload, {foo: 'bar', bar: 'foo'})
    })
    ft.run([
      () => {
        return {bar: 'foo'}
      }
    ], {foo: 'bar'})
  })

  it('should be able to reuse existing tree', (done) => {
    function actionA ({path}) {
      assert.ok(true)
      return path.success()
    }

    function actionB ({path}) {
      assert.ok(true)
      return path.success()
    }

    function actionC () {
      assert.ok(true)
    }

    const ft = new FunctionTree([])
    const tree = [
      actionA, {
        success: [
          actionB, {
            success: [
              actionC
            ]
          }
        ]
      }
    ]

    ft.run(tree, () => {
      ft.run(tree, () => {
        done()
      })
    })
  })
  it('should give error when path and no path returned', (done) => {
    function actionA () {
      return {
        foo: 'bar'
      }
    }

    const ft = new FunctionTree([])
    const tree = [
      actionA, {
        success: []
      }
    ]

    ft.once('error', (error) => {
      assert.ok(error instanceof FunctionTreeExecutionError)
      assert.ok(error.message.match(/needs to be a path or a Promise/))
      done()
    })
    ft.run(tree).catch(() => {})
  })
  it('should provide unique index to functions, even though the same', () => {
    function actionA () {}
    let count = 0
    const ft = new FunctionTree([
      function (context, functionDetails) {
        if (count === 0) {
          assert.equal(functionDetails.functionIndex, 0)
        } else {
          assert.equal(functionDetails.functionIndex, 1)
        }

        count++

        return context
      }
    ])
    const tree = [
      actionA,
      actionA
    ]
    ft.run(tree)
  })
  it('should emit branchStart and branchEnd events', () => {
    let branchStartCount = 0
    let branchEndCount = 0
    function actionA ({path}) {
      return path.test()
    }
    function actionB () {}
    function actionC () {}
    const ft = new FunctionTree([])
    const tree = [
      actionA, {
        test: [actionB]
      },
      actionA, {
        test: [actionB]
      },
      actionC
    ]
    ft.on('pathStart', () => {
      branchStartCount++
    })
    ft.on('pathEnd', () => {
      branchEndCount++
    })
    ft.run(tree)
    assert(branchStartCount, 2)
    assert(branchEndCount, 2)
  })
  it('should pass correct props on empty paths', () => {
    function actionA ({path}) {
      return path.true()
    }
    function actionB ({props}) {
      assert.deepEqual(props, {foo: 'bar'})
    }
    const ft = new FunctionTree([])
    const tree = [
      actionA, {
        true: [],
        false: []
      },
      actionB
    ]
    ft.run(tree, {
      foo: 'bar'
    })
  })
  it('should emit parallel events', (done) => {
    function actionA () {
      return Promise.resolve({bar: 'baz'})
    }
    function actionB () {
      return Promise.resolve()
    }
    const ft = new FunctionTree([])
    const tree = [
      [
        actionA,
        actionB
      ]
    ]
    ft.once('parallelStart', (execution, currentPayload, functionsToResolve) => {
      assert.ok(execution)
      assert.deepEqual(currentPayload, {
        foo: 'bar'
      })
      assert.equal(functionsToResolve, 2)
    })
    ft.once('parallelProgress', (execution, currentPayload, functionsResolving) => {
      assert.ok(execution)
      assert.deepEqual(currentPayload, {
        foo: 'bar',
        bar: 'baz'
      })
      assert.equal(functionsResolving, 1)
    })
    ft.once('parallelEnd', (execution, currentPayload, functionsResolved) => {
      assert.ok(execution)
      assert.deepEqual(currentPayload, {
        foo: 'bar'
      })
      assert.equal(functionsResolved, 2)
    })
    ft.once('end', (execution, finalPayload) => {
      assert.deepEqual(finalPayload, {
        foo: 'bar',
        bar: 'baz'
      })
      done()
    })

    ft.run(tree, {
      foo: 'bar'
    })
  })
  it('should run functions in parallel', (done) => {
    const results = []
    function funcA () {
      return Promise.resolve().then(() => { results.push('A') })
    }
    function funcB () {
      results.push('B')
    }
    const ft = new FunctionTree([])
    const tree = [
      parallel([
        funcA,
        funcB
      ])
    ]

    ft.once('end', () => {
      assert.deepEqual(results, ['B', 'A'])
      done()
    })

    ft.run(tree)
  })
  it('should run grouped functions sequencially inside parallel', (done) => {
    const results = []
    function funcA () {
      return Promise.resolve().then(() => { results.push('A') })
    }
    function funcB () {
      results.push('B')
    }
    const group = [
      function funC () {
        return Promise.resolve().then(() => { results.push('C') })
      },
      function funcD () {
        results.push('D')
      }
    ]
    const ft = new FunctionTree([])
    const tree = [
      parallel([
        funcA,
        funcB,
        group
      ])
    ]

    ft.once('end', () => {
      assert.deepEqual(results, ['B', 'A', 'C', 'D'])
      done()
    })

    ft.run(tree)
  })
  it('should run functions after sequence', (done) => {
    let executedCount = 0
    const ft = new FunctionTree([])

    function funcA () { executedCount++ }
    function funcB () { executedCount++ }
    function funcC () { executedCount++ }

    const tree = [
      [
        funcA,
        funcB
      ],
      funcC
    ]

    ft.once('end', () => {
      assert.equal(executedCount, 3)
      done()
    })

    ft.run(tree)
  })
  it('should not continue async execution when error thrown', (done) => {
    let executedCount = 0
    const ft = new FunctionTree([])

    function funcA ({path}) {
      return Promise.resolve(path.test())
    }
    function funcB () {
      throw new Error('foo')
    }
    function funcC () { executedCount++ }

    const tree = parallel([
      funcA, {
        test: funcC
      },
      funcB
    ])

    ft.run(tree)
      .catch(() => {
        setTimeout(() => {
          assert.equal(executedCount, 0)
          done()
        })
      })
  })
  it('should add stuff to context by passing in an object', (done) => {
    const ft = new FunctionTree({
      foo: {
        bar () { return 'bar' }
      }
    })

    ft.run([
      function (context) {
        assert.ok(context.foo.bar(), 'bar')
        done()
      }
    ])
  })
  it('should add stuff to context by passing in an object in the array', (done) => {
    const ft = new FunctionTree([{
      foo: {
        bar () { return 'bar' }
      }
    }])

    ft.run([
      function (context) {
        assert.ok(context.foo.bar(), 'bar')
        done()
      }
    ])
  })
})
