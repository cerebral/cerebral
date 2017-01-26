/* eslint-env mocha */
import * as utils from './utils'
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
  describe('dependencyMatch', () => {
    it('should match dependencies', () => {
      assert.equal(utils.dependencyMatch({
        foo: true
      }, {
        foo: true
      }).length, 1)
      assert.equal(utils.dependencyMatch({}, {
        foo: true
      }).length, 0)
    })
    it('should match nested dependencies', () => {
      assert.ok(utils.dependencyMatch({
        foo: {
          bar: true
        }
      }, {
        'foo.bar': true
      }).length, 1)
    })
    it('should match child interest dependencies', () => {
      assert.equal(utils.dependencyMatch({
        foo: {
          bar: true
        }
      }, {
        'foo': true
      }).length, 0)
      assert.equal(utils.dependencyMatch({
        foo: {
          bar: true
        }
      }, {
        'foo.*': true
      }).length, 1)
      assert.equal(utils.dependencyMatch({
        foo: {
          bar: true
        }
      }, {
        'foo.**': true
      }).length, 1)
    })
    it('should match exact paths', () => {
      assert.equal(utils.dependencyMatch({
        foo: {
          bar: true
        }
      }, {
        'foo.bar': true
      }).length, 1)
      assert.equal(utils.dependencyMatch({
        foo: {
          bar: true
        }
      }, {
        'foo.barbar': true
      }).length, 0)
    })
  })
})
