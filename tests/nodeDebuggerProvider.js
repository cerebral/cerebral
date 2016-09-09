'use strict'
const FunctionTree = require('../src')
const ContextProvider = require('../providers/Context')
const NodeDebuggerProvider = require('../providers/NodeDebugger')

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
      test.notEqual(originalFunc, contextItem.foo)
      test.equal(contextItem.foo.__ft_originFunc, originalFunc)
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

  test.expect(2)
  execute([
    function funcA(context) {
      test.notEqual(contextItem, context.contextItem)
      test.equal(context.contextItem.__ft_originFunc, contextItem)
    }
  ])
  test.done()
}
