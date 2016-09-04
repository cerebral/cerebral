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
  const execute = FunctionTree([
    NodeDebuggerProvider(),
    ContextProvider({
      contextItem
    })
  ])

  test.expect(1)
  execute([
    function funcA(context) {
      test.notEqual(context.contextItem.foo, contextItem.foo)
    }
  ])
  test.done()
}
