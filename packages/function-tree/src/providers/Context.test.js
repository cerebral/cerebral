/* eslint-env mocha */
import FunctionTree from '../'
import ContextProvider from './Context'
import assert from 'assert'

describe('ContextProvider', () => {
  it('should add whatever is passed on to the context', () => {
    const ft = new FunctionTree([
      ContextProvider({
        foo: 'bar'
      })
    ])

    ft.run([
      ({foo}) => {
        assert.equal(foo, 'bar')
      }
    ])
  })
  it('should run with DebuggerProvider', () => {
    const DebuggerProvider = () => {
      function provider (context, functionDetails, payload) {
        context.debugger = {
          send (data) {
            assert.ok(data)
          }
        }

        return context
      }

      return provider
    }
    const ft = new FunctionTree([
      DebuggerProvider(),
      ContextProvider({
        foo: 'bar'
      })
    ])

    ft.run([
      ({foo}) => {
        assert.equal(foo, 'bar')
        assert.equal(foo.length, 3)
      }
    ])
  })
  it('should run with DebuggerProvider when passed value is function', () => {
    const DebuggerProvider = () => {
      function provider (context, functionDetails, payload) {
        context.debugger = {
          send (data) {
            assert.ok(data)
          }
        }

        return context
      }

      return provider
    }
    const ft = new FunctionTree([
      DebuggerProvider(),
      ContextProvider({
        foo: (baz) => { return 'bar' + baz }
      })
    ])

    ft.run([
      ({foo}) => {
        assert.equal(foo('baz'), 'barbaz')
      }
    ])
  })
  it('should run with DebuggerProvider when passed value is function instance', () => {
    const Test = function (foo) {
      this.foo = foo
      this.getFoo = function () { return this.foo }
      this.setFoo = function (value) { this.foo = value }
    }
    const DebuggerProvider = () => {
      function provider (context, functionDetails, payload) {
        context.debugger = {
          send (data) {
            assert.ok(data)
          }
        }

        return context
      }

      return provider
    }
    const ft = new FunctionTree([
      DebuggerProvider(),
      ContextProvider({
        test: new Test('foo')
      })
    ])

    ft.run([
      ({test}) => {
        assert.equal(test.foo, 'foo')
        test.setFoo('bar')
        assert.equal(test.getFoo(), 'bar')
      }
    ])
  })
})
