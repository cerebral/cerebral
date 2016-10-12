/* eslint-env mocha */
import {rules} from '../src'
import assert from 'assert'

describe('rules', () => {
  describe('isExisty', () => {
    it('should return false due to null', () => {
      assert.equal(rules.isExisty(null), false)
    })

    it('should return true due to empty string', () => {
      assert.equal(rules.isExisty(''), true)
    })
  })

  describe('isEmpty', () => {
    it('should return true due to empty string', () => {
      assert.equal(rules.isEmpty(''), true)
    })

    it('should return false due to whitespace', () => {
      assert.equal(rules.isEmpty(' '), false)
    })
  })

  describe('isValue', () => {
    it('should return false due to empty string', () => {
      assert.equal(rules.isValue(''), false)
    })

    it('should return false due to null', () => {
      assert.equal(rules.isValue(null), false)
    })

    it('should return false due to undefined', () => {
      assert.equal(rules.isValue(undefined), false)
    })

    it('should return false due to empty Array', () => {
      assert.equal(rules.isValue([]), false)
    })

    it('should return false due to false', () => {
      assert.equal(rules.isValue(false), false)
    })

    it('should return true due to string value', () => {
      assert.equal(rules.isValue('some value'), true)
    })

    it('should return true due to Array value', () => {
      assert.equal(rules.isValue(['some value']), true)
    })
  })

  describe('isUndefined', () => {
    it('should return false due to empty string', () => {
      assert.equal(rules.isUndefined(''), false)
    })

    it('should return true due to undefined', () => {
      assert.equal(rules.isUndefined(undefined), true)
    })
  })

  describe('isEmail', () => {
    it('should return false due to lack of @', () => {
      assert.equal(rules.isEmail('somw.gmail.com'), false)
    })

    it('should return false due to lack of .', () => {
      assert.equal(rules.isEmail('some@gmail'), false)
    })

    it('should return false due to whitespace', () => {
      assert.equal(rules.isEmail('some@ gmail.com'), false)
    })

    it('should return false due to multiple @', () => {
      assert.equal(rules.isEmail('some@gmail@.com'), false)
    })

    it('should return true due to correct email', () => {
      assert.equal(rules.isEmail('some@gmail.com'), true)
    })
  })

  describe('isUrl', () => {
    it('should return false due to lack of protocol', () => {
      assert.equal(rules.isUrl('www.google.com'), false)
    })

    it('should return false due to whitespace', () => {
      assert.equal(rules.isUrl('http://www.google.com /path'), false)
    })

    it('should return true due to correct url', () => {
      assert.equal(rules.isUrl('http://some.com/path'), true)
    })

    it('should return true due to https', () => {
      assert.equal(rules.isUrl('https://some.com/path'), true)
    })
  })

  describe('isTrue', () => {
    it('should return false due to false', () => {
      assert.equal(rules.isTrue(false), false)
    })

    it('should return false due to `true` is passed as string', () => {
      assert.equal(rules.isTrue('true'), false)
    })

    it('should return true due to true is passed', () => {
      assert.equal(rules.isTrue(true), true)
    })
  })

  describe('isFalse', () => {
    it('should return false due to true', () => {
      assert.equal(rules.isFalse(true), false)
    })

    it('should return false due to `false` is passed as string', () => {
      assert.equal(rules.isFalse('false'), false)
    })

    it('should return true due to false is passed', () => {
      assert.equal(rules.isFalse(false), true)
    })
  })
})
