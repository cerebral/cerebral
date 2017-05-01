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
})
