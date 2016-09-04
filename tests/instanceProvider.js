'use strict'

const FunctionTree = require('../src')

module.exports['should expose the instance on the context'] = (test) => {
  const execute = FunctionTree()

  test.expect(4)
  execute('something', [
    function action(context) {
      test.equal(context._instance.name, 'something')
      test.ok(context._instance.id)
      test.ok(context._instance.datetime)
      test.ok(context._instance.staticTree)
    }
  ])
  test.done()
}
