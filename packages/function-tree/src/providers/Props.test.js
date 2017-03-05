/* eslint-env mocha */
import FunctionTree from '../'
import assert from 'assert'

describe('PropsProvider', () => {
  it('should have "props" on context', () => {
    const execute = FunctionTree()

    execute([
      ({props}) => {
        assert.ok(props)
      }
    ])
  })
  it('should have initial payload on props', () => {
    const execute = FunctionTree()

    execute([
      ({props}) => {
        assert.deepEqual(props, {
          foo: 'bar'
        })
      }
    ], {
      foo: 'bar'
    })
  })
})
