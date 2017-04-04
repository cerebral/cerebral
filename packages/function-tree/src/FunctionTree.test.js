/* eslint-env mocha */
import FunctionTree, {sequence, parallel} from './'
import assert from 'assert'

describe('FunctionTree', () => {
  it('should create a function tree extending event emitter', () => {
    const execute = FunctionTree([])

    assert.equal(typeof execute.on, 'function')
    assert.equal(typeof execute.once, 'function')
    assert.equal(typeof execute.off, 'function')
  })
  it('should run functions', () => {
    const execute = FunctionTree()

    execute([
      () => {
        assert.ok(true)
      }
    ])
  })
  it('should run sequences', () => {
    const execute = FunctionTree()

    execute(sequence([
      () => {
        assert.ok(true)
      }
    ]))
  })
  it('should pass arguments to context creator and run it for each action', () => {
    const execute = FunctionTree([
      function SomeProvider (context, functionDetails, payload, prevPayload) {
        assert.ok(context)
        assert.equal(functionDetails.functionIndex, 0)
        assert.deepEqual(payload, {foo: 'bar'})
        assert.equal(prevPayload, null)

        return context
      }
    ])

    execute([
      () => {}
    ], {
      foo: 'bar'
    })
  })
  it('should pass previous payload to context provider', () => {
    const execute = FunctionTree([
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

    execute([
      () => ({foo: 'bar2'}),
      () => {}
    ], {
      foo: 'bar'
    })
  })
  it('should pass returned context into functions', () => {
    const execute = FunctionTree([
      function SomeProvider (context) {
        context.foo = 'bar'

        return context
      }
    ])

    execute([
      ({foo}) => {
        assert.equal(foo, 'bar')
      }
    ])
  })
  it('should emit execution events in correct order', () => {
    let eventsCount = 0
    const execute = FunctionTree()

    execute.once('start', function () {
      eventsCount++
      assert.equal(eventsCount, 1)
    })
    execute.once('functionStart', function () {
      eventsCount++
      assert.equal(eventsCount, 2)
      execute.once('functionStart', function () {
        eventsCount++
        assert.equal(eventsCount, 4)
      })
    })
    execute.once('functionEnd', function () {
      eventsCount++
      assert.equal(eventsCount, 3)
      execute.once('functionEnd', function () {
        eventsCount++
        assert.equal(eventsCount, 5)
      })
    })
    execute.on('end', function () {
      eventsCount++
      assert.equal(eventsCount, 6)
    })
    execute([
      function actionA () {},
      function actionB () {}
    ])
  })
  it('should pass action and payload on action events', () => {
    const execute = FunctionTree()

    execute.once('functionStart', function (execution, functionDetails, payload) {
      assert.ok(execution.id)
      assert.equal(functionDetails.functionIndex, 0)
      assert.deepEqual(payload, {foo: 'bar'})
    })
    execute.once('functionEnd', function (execution, functionDetails, payload) {
      assert.ok(execution.id)
      assert.equal(functionDetails.functionIndex, 0)
      assert.deepEqual(payload, {foo: 'bar'})
    })
    execute([
      () => {}
    ], {
      foo: 'bar'
    })
  })
  it('should indicate parallel execution on function', () => {
    const execute = FunctionTree()

    execute.once('functionStart', function (execution, functionDetails) {
      assert.ok(true)
    })
    execute([
      parallel([
        () => {},
        () => {}
      ])
    ])
  })
  it('should pass final payload on end event', () => {
    const execute = FunctionTree()
    execute.once('end', (execution, payload) => {
      assert.deepEqual(payload, {foo: 'bar', bar: 'foo'})
    })
    execute([
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

    const execute = FunctionTree([])
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
    execute(tree).then(() => {
      execute(tree).then(() => {
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

    const execute = FunctionTree([])
    const tree = [
      actionA, {
        success: []
      }
    ]

    execute(tree).catch((error) => {
      assert.ok(error.message.match(/needs to be a path or a Promise/))
      done()
    })
  })
  it('should provide unique index to functions, even though the same', () => {
    function actionA () {}
    let count = 0
    const execute = FunctionTree([
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
    execute(tree)
  })
  it('should emit branchStart and branchEnd events', () => {
    let branchStartCount = 0
    let branchEndCount = 0
    function actionA ({path}) {
      return path.test()
    }
    function actionB () {}
    function actionC () {}
    const execute = FunctionTree([])
    const tree = [
      actionA, {
        test: [actionB]
      },
      actionA, {
        test: [actionB]
      },
      actionC
    ]
    execute.on('pathStart', () => {
      branchStartCount++
    })
    execute.on('pathEnd', () => {
      branchEndCount++
    })
    execute(tree)
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
    const execute = FunctionTree([])
    const tree = [
      actionA, {
        true: [],
        false: []
      },
      actionB
    ]
    execute(tree, {
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
    const execute = FunctionTree([])
    const tree = [
      [
        actionA,
        actionB
      ]
    ]
    execute.once('parallelStart', (execution, currentPayload, functionsToResolve) => {
      assert.ok(execution)
      assert.deepEqual(currentPayload, {
        foo: 'bar'
      })
      assert.equal(functionsToResolve, 2)
    })
    execute.once('parallelProgress', (execution, currentPayload, functionsResolving) => {
      assert.ok(execution)
      assert.deepEqual(currentPayload, {
        foo: 'bar',
        bar: 'baz'
      })
      assert.equal(functionsResolving, 1)
    })
    execute.once('parallelEnd', (execution, currentPayload, functionsResolved) => {
      assert.ok(execution)
      assert.deepEqual(currentPayload, {
        foo: 'bar'
      })
      assert.equal(functionsResolved, 2)
    })
    execute.once('end', (execution, finalPayload) => {
      assert.deepEqual(finalPayload, {
        foo: 'bar',
        bar: 'baz'
      })
      done()
    })

    execute(tree, {
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
    const execute = FunctionTree([])
    const tree = [
      parallel([
        funcA,
        funcB
      ])
    ]

    execute.once('end', () => {
      assert.deepEqual(results, ['B', 'A'])
      done()
    })

    execute(tree)
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
    const execute = FunctionTree([])
    const tree = [
      parallel([
        funcA,
        funcB,
        group
      ])
    ]

    execute.once('end', () => {
      assert.deepEqual(results, ['B', 'A', 'C', 'D'])
      done()
    })

    execute(tree)
  })
  it('should run functions after sequence', (done) => {
    let executedCount = 0
    const execute = FunctionTree([])

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

    execute.once('end', () => {
      assert.equal(executedCount, 3)
      done()
    })

    execute(tree)
  })
  it('should not continue async execution when error thrown', (done) => {
    let executedCount = 0
    const execute = FunctionTree([])

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

    execute(tree)
      .catch(() => {
        setTimeout(() => {
          assert.equal(executedCount, 0)
          done()
        })
      })
  })
  it('should add stuff to context by passing in an object', (done) => {
    const execute = FunctionTree({
      foo: {
        bar () { return 'bar' }
      }
    })

    execute([
      function (context) {
        assert.ok(context.foo.bar(), 'bar')
        done()
      }
    ])
  })
  it('should add stuff to context by passing in an object in the array', (done) => {
    const execute = FunctionTree([{
      foo: {
        bar () { return 'bar' }
      }
    }])

    execute([
      function (context) {
        assert.ok(context.foo.bar(), 'bar')
        done()
      }
    ])
  })
})
