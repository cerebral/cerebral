'use strict'

const FunctionTree = require('../src')

module.exports['should add output function'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function action(context) {
      test.ok(context.result)
    }
  ])
  test.done()
}

module.exports['should have possible outputs as methods'] = (test) => {
  const execute = FunctionTree()

  test.expect(2)
  execute([
    function action(context) {
      test.ok(context.result.foo)
      test.ok(context.result.bar)
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
    function actionA(context) {
      return context.result.foo()
    }, {
      foo: [
        function actionB() {
          test.ok(true)
        }
      ],
      bar: []
    }
  ])
  test.done()
}

module.exports['should pass payload down outputs'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function actionA(context) {
      return context.result.foo({foo: 'bar'})
    }, {
      foo: [
        function actionB(context) {
          test.deepEqual(context.input, {foo: 'bar'})
        }
      ],
      bar: []
    }
  ])
  test.done()
}

module.exports['should pass payload async'] = (test) => {
  function actionA(context) {
    return new Promise((resolve) => {
      setTimeout(function () {
        resolve(context.result.foo({foo: 'bar'}))
      })
    })
  }

  function actionB(context) {
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
