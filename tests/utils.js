import * as utils from '../src/utils'
import assert from 'assert'

describe('utils', () => {
  describe('isSerializable', () => {
    it('should return true on strings', () => {
      assert.ok(utils.isSerializable('foo'))
    })
    it('should return true on numbers', () => {
      assert.ok(utils.isSerializable(123))
    })
    it('should return true on boolean', () => {
      assert.ok(utils.isSerializable(true))
    })
    it('should return true on arrays', () => {
      assert.ok(utils.isSerializable([]))
    })
    it('should return true on plain objects', () => {
      assert.ok(utils.isSerializable({}))
    })
    it('should return false on classes', () => {
      class Test {}
      assert.equal(utils.isSerializable(new Test()), false)
    })
    it('should return false on functions', () => {
      assert.equal(utils.isSerializable(() => {}), false)
    })
    it('should return false on dates', () => {
      assert.equal(utils.isSerializable(new Date()), false)
    })
  })
})
