/* eslint-env mocha */
import FunctionTree from '../src'
import assert from 'assert'

describe('InputProvider', () => {
  it('should have "input" on context', () => {
    const execute = FunctionTree()

    execute([
      ({input}) => {
        assert.ok(input)
      }
    ])
  })
  it('should have initial payload on input', () => {
    const execute = FunctionTree()

    execute([
      ({input}) => {
        assert.deepEqual(input, {
          foo: 'bar'
        })
      }
    ], {
      foo: 'bar'
    })
  })
})
