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
      assert.equal(utils.dependencyMatch([{
        path: ['foo']
      }], {
        foo: {}
      }).length, 1)
      assert.equal(utils.dependencyMatch([], {
        foo: {}
      }).length, 0)
    })
    it('should match nested dependencies', () => {
      assert.ok(utils.dependencyMatch([{
        path: ['foo', 'bar']
      }], {
        foo: {
          children: {
            bar: {}
          }
        }
      }).length, 1)
    })
    it('should match child interest dependencies', () => {
      assert.equal(utils.dependencyMatch([{
        path: ['foo', 'bar']
      }], {
        'foo': {}
      }).length, 0)
      assert.equal(utils.dependencyMatch([{
        path: ['foo', 'bar']
      }], {
        foo: {
          children: {
            '*': {}
          }
        }
      }).length, 1)
      assert.equal(utils.dependencyMatch([{
        path: ['foo', 'bar']
      }], {
        foo: {
          children: {
            '**': {}
          }
        }
      }).length, 1)
    })
    it('should match exact paths', () => {
      assert.equal(utils.dependencyMatch([{
        path: ['foo', 'bar']
      }], {
        foo: {
          children: {
            bar: {}
          }
        }
      }).length, 1)
      assert.equal(utils.dependencyMatch([{
        path: ['foo', 'bar']
      }], {
        foo: {
          children: {
            barbar: {}
          }
        }
      }).length, 0)
    })
  })
})
