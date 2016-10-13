'use strict'

const FunctionTree = require('../src')

module.exports['should expose the instance on the context'] = (test) => {
  const execute = FunctionTree()

  test.expect(4)
  execute('something', [
    function action (context) {
      test.equal(context.execution.name, 'something')
      test.ok(context.execution.id)
      test.ok(context.execution.datetime)
      test.ok(context.execution.staticTree)
    }
  ])
  test.done()
}

module.exports['should be able to retry execution'] = (test) => {
  const execute = FunctionTree()
  test.expect(1)
  let count = 0
  function funcA () {
    return new Promise(resolve => {
      resolve()
    })
  }

  function funcB (context) {
    if (context.input.retryCount < 3) {
      count++
      return context.execution.retry({
        retryCount: context.input.retryCount + 1
      })
    }
  }

  execute([
    funcA,
    funcB
  ], {
    retryCount: 0
  }, () => {
    test.equals(count, 3)
    test.done()
  })
}

module.exports['should be able to abort execution'] = (test) => {
  const execute = FunctionTree()
  test.expect(1)
  let count = 0
  function funcA (context) {
    return context.execution.abort()
  }

  function funcB () {
    count++
  }

  execute.on('abort', () => {
    test.equals(count, 0)
    test.done()
  })
  execute([
    funcA,
    funcB
  ])
}
