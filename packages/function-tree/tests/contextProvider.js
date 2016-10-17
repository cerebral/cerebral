/* eslint-env mocha */
import FunctionTree from '../src'
import ContextProvider from '../src/providers/Context'
import assert from 'assert'

describe('ContextProvider', () => {
  it('should add whatever is passed on to the context', () => {
    const execute = FunctionTree([
      ContextProvider({
        foo: 'bar'
      })
    ])

    execute([
      ({foo}) => {
        assert.equal(foo, 'bar')
      }
    ])
  })
})
