'use strict'

const FunctionTree = require('../src')

module.exports['should have "input" on context'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function action (context) {
      test.ok(context.input)
    }
  ])
  test.done()
}

module.exports['should have initial payload on input'] = (test) => {
  const execute = FunctionTree()

  test.expect(1)
  execute([
    function action (context) {
      test.deepEqual(context.input, {
        foo: 'bar'
      })
    }
  ], {
    foo: 'bar'
  })
  test.done()
}
