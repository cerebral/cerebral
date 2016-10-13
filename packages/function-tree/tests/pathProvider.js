'use strict'

const FunctionTree = require('../src')

module.exports['should add path function when paths can be taken'] = (test) => {
  const execute = FunctionTree()

  test.expect(2)
  execute([
    function action (context) {
      test.ok(context.path.success)
      test.ok(context.path.error)
      return context.path.success()
    }, {
      success: [],
      error: []
    }
  ])
  test.done()
}

module.exports['should NOT add path function when paths can NOT be taken'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function action (context) {
      test.ok(!context.path)
    }
  ])
  test.done()
}

module.exports['should have possible outputs as methods'] = (test) => {
  const execute = FunctionTree()

  test.expect(2)
  execute([
    function action (context) {
      test.ok(context.path.foo)
      test.ok(context.path.bar)
      return context.path.foo()
    }, {
      foo: [],
      bar: []
    }
  ])
  test.done()
}

module.exports['should go down path based on method used'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function actionA (context) {
      return context.path.foo()
    }, {
      foo: [
        function actionB () {
          test.ok(true)
        }
      ],
      bar: []
    }
  ])
  test.done()
}

module.exports['should pass payload down paths'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function actionA (context) {
      return context.path.foo({foo: 'bar'})
    }, {
      foo: [
        function actionB (context) {
          test.deepEqual(context.input, {foo: 'bar'})
        }
      ],
      bar: []
    }
  ])
  test.done()
}

module.exports['should pass payload async'] = (test) => {
  function actionA (context) {
    return new Promise((resolve) => {
      setTimeout(function () {
        resolve(context.path.foo({foo: 'bar'}))
      })
    })
  }

  function actionB (context) {
    test.deepEqual(context.input, {foo: 'bar'})
  }

  const execute = FunctionTree()

  test.expect(1)
  execute([
    actionA, {
      foo: [
        actionB
      ],
      bar: []
    }
  ], test.done)
}
