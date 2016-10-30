/* eslint-env mocha */
import Controller from '../Controller'
import assert from 'assert'

describe('VerifyInput', () => {
  it('should throw when invalid input', () => {
    const controller = new Controller({
      state: {
        foo: 'bar'
      }
    })
    assert.throws(() => {
      const obj = {}
      obj.circular = obj
      controller.getSignal('foo')(obj)
    })
  })
})
