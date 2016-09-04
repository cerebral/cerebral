'use strict'
const FunctionTree = require('../src')
const ContextProvider = require('../providers/Context')

module.exports['should add whatever is passed into the context'] = (test) => {
  const execute = FunctionTree([
    ContextProvider({
      foo: 'bar'
    })
  ])

  test.expect(1)
  execute([
    function func(context) {
      test.equal(context.foo, 'bar')
    }
  ])
  test.done()
}
