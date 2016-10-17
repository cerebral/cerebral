/* eslint-env mocha */
import FunctionTree from '../src'
import assert from 'assert'
import ContextProvider from '../src/providers/Context'
import NodeDebuggerProvider from '../src/providers/NodeDebugger'

describe('NodeDebuggerProvider', () => {
  it('should expose debugger on context', () => {
    const someLib = {
      foo () {}
    }
    const execute = FunctionTree([
      NodeDebuggerProvider(),
      ContextProvider({
        someLib
      })
    ])

    execute([
      function actionA (context) {
        assert.ok(context.debugger)
      }
    ])
  })
  it('should wrap methods on added object', () => {
    const contextItem = {
      foo () {}
    }
    const originalFunc = contextItem.foo
    const execute = FunctionTree([
      NodeDebuggerProvider(),
      ContextProvider({
        contextItem
      })
    ])

    execute([
      function actionA ({foo}) {
        assert.equal(originalFunc, contextItem.foo)
        assert.notEqual(foo, originalFunc)
      }
    ])
  })
  it('should wrap functions added to context', () => {
    const contextItem = () => {}

    const execute = FunctionTree([
      NodeDebuggerProvider(),
      ContextProvider({
        contextItem
      })
    ])

    execute([
      function actionA (context) {
        assert.notEqual(contextItem, context.contextItem)
      }
    ])
  })
})
