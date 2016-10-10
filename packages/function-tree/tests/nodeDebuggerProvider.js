'use strict'
const FunctionTree = require('../src')
const ContextProvider = require('../src/providers/Context')
const NodeDebuggerProvider = require('../src/providers/NodeDebugger')

module.exports['should expose debugger on context'] = (test) => {
  const someLib = {
    foo() {}
  }
  const execute = FunctionTree([
    NodeDebuggerProvider(),
    ContextProvider({
      someLib
    })
  ])

  test.expect(1)
  execute([
    function funcA(context) {
      test.ok(context.debugger)
    }
  ])
  test.done()
}

module.exports['should wrap methods on added object'] = (test) => {
  const contextItem = {
    foo() {}
  };
  const originalFunc = contextItem.foo
  const execute = FunctionTree([
    NodeDebuggerProvider(),
    ContextProvider({
      contextItem
    })
  ])

  test.expect(2)
  execute([
    function funcA(context) {
      test.equal(originalFunc, contextItem.foo)
      test.notEqual(context.foo, originalFunc)
    }
  ])
  test.done()
}

module.exports['should wrap functions added to context'] = (test) => {
  const contextItem = () => {};

  const execute = FunctionTree([
    NodeDebuggerProvider(),
    ContextProvider({
      contextItem
    })
  ])

  test.expect(1)
  execute([
    function funcA(context) {
      test.notEqual(contextItem, context.contextItem)
    }
  ])
  test.done()
}
