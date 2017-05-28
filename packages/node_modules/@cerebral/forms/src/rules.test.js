/* eslint-env mocha */
import { rules } from '.'
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

  describe('isNumeric', () => {
    it('should return false due to string', () => {
      assert.equal(rules.isNumeric('some string'), false)
    })

    it('should return false due to string and number', () => {
      assert.equal(rules.isNumeric(1212 + 'some string'), false)
    })

    it('should return true due to integer', () => {
      assert.equal(rules.isNumeric(1212), true)
    })

    it('should return false due to number and points', () => {
      assert.equal(rules.isNumeric('1212.12.1.2'), false)
    })

    it('should return true due to float', () => {
      assert.equal(rules.isNumeric(1212.34), true)
    })

    it('should return true due to NaN', () => {
      assert.equal(rules.isNumeric(NaN), true)
    })
  })

  describe('isAlpha', () => {
    it('should return false due to number', () => {
      assert.equal(rules.isAlpha(1212), false)
    })

    it('should return false due to number and string', () => {
      assert.equal(rules.isAlpha(1212 + 'somestring'), false)
    })

    it('should return false due to string with @', () => {
      assert.equal(rules.isAlpha('somestring@'), false)
    })

    it('should return false due to string with whitespace', () => {
      assert.equal(rules.isAlpha('somestring '), false)
    })

    it('should return false due to string with åäö', () => {
      assert.equal(rules.isAlpha('somestringåäö'), false)
    })

    it('should return true due to string with only alpha', () => {
      assert.equal(rules.isAlpha('somestring'), true)
    })
  })

  describe('isAlphanumeric', () => {
    it('should return true due to number', () => {
      assert.equal(rules.isAlphanumeric(1212), true)
    })

    it('should return true due to number and string', () => {
      assert.equal(rules.isAlphanumeric(1212 + 'somestring'), true)
    })

    it('should return false due to string with @', () => {
      assert.equal(rules.isAlphanumeric('somestring@'), false)
    })

    it('should return false due to string with whitespace', () => {
      assert.equal(rules.isAlphanumeric('somestring '), false)
    })

    it('should return false due to string with åäö', () => {
      assert.equal(rules.isAlphanumeric('somestringåäö'), false)
    })
  })

  describe('isInt', () => {
    it('should return true due to number', () => {
      assert.equal(rules.isInt(1212), true)
    })

    it('should return false due to number and string', () => {
      assert.equal(rules.isInt(1212 + 'somestring'), false)
    })

    it('should return false due to string', () => {
      assert.equal(rules.isInt('somestring'), false)
    })

    it('should return false due to float', () => {
      assert.equal(rules.isInt(1212.12), false)
    })
  })

  describe('isFloat', () => {
    it('should return false due to number without .', () => {
      assert.equal(rules.isFloat(1212), true)
    })

    it('should return false due to number and string', () => {
      assert.equal(rules.isFloat(1212 + 'somestring'), false)
    })

    it('should return false due to string', () => {
      assert.equal(rules.isFloat('somestring'), false)
    })

    it('should return true due to float', () => {
      assert.equal(rules.isFloat(1212.12), true)
    })
  })

  describe('isWords', () => {
    it('should return true due to single string', () => {
      assert.equal(rules.isWords('somestring'), true)
    })

    it('should return false due to åäö', () => {
      assert.equal(rules.isWords('somestringåäö'), false)
    })

    it('should return true due to two words', () => {
      assert.equal(rules.isWords('somestring somemore'), true)
    })
  })

  describe('isSpecialWords', () => {
    it('should return true due to åäö', () => {
      assert.equal(rules.isSpecialWords('somestringåäö'), true)
    })

    it('should return true due to whitespace', () => {
      assert.equal(rules.isSpecialWords('somestring somemore'), true)
    })

    it('should return false due to number', () => {
      assert.equal(rules.isSpecialWords('somestring' + 1212), false)
    })
  })

  describe('isLength', () => {
    it('should return true due to length 4', () => {
      assert.equal(rules.isLength('some', 4), true)
    })

    it('should return false due to length 5', () => {
      assert.equal(rules.isLength('some1', 4), false)
    })
  })

  describe('equals', () => {
    it('should return true due to same string', () => {
      assert.equal(rules.equals('some', 'some'), true)
    })

    it('should return false due to not same string', () => {
      assert.equal(rules.equals('some1', 'some'), false)
    })

    it('should return true due to empty strings', () => {
      assert.equal(rules.equals('', ''), true)
    })
  })

  describe('equalsField', () => {
    it('should return true due to same value', () => {
      assert.equal(
        rules.equalsField('Bob', 'form.firstname', () => {
          return 'Bob'
        }),
        true
      )
    })

    it('should return false due to not same value', () => {
      assert.equal(
        rules.equalsField('Bobby', 'form.firstname', () => {
          return 'Bo'
        }),
        false
      )
    })
  })

  describe('maxLength', () => {
    it('should return true due to length < 5', () => {
      assert.equal(rules.maxLength('some', 5), true)
    })

    it('should return true due to length === 4', () => {
      assert.equal(rules.maxLength('some', 4), true)
    })

    it('should return false due to length > 4', () => {
      assert.equal(rules.maxLength('some1', 4), false)
    })
  })

  describe('minLength', () => {
    it('should return false due to length < 5', () => {
      assert.equal(rules.minLength('some', 5), false)
    })

    it('should return true due to length === 4', () => {
      assert.equal(rules.minLength('some', 4), true)
    })

    it('should return true due to length > 4', () => {
      assert.equal(rules.minLength('some1', 4), true)
    })

    it('should return true due to empty field', () => {
      assert.equal(rules.minLength('', 4), true)
    })
  })
})
