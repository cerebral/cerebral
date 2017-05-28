/* eslint-env mocha */
import assert from 'assert'
import checkHasValue from './utils/checkHasValue'

describe('utils', () => {
  it('should return false due to not having a value', () => {
    const hasValue = checkHasValue('', ['isValue'])
    assert.equal(hasValue, false)
  })

  it('should return false due to non-numeric a value', () => {
    const hasValue = checkHasValue('123a', ['isValue', 'isNumeric'])
    assert.equal(hasValue, false)
  })

  it('should throw error for undefined validationRule', () => {
    assert.throws(
      () => {
        checkHasValue(' ', ['someValidationRule'])
      },
      Error,
      'Rule someValidationRule is not found'
    )
  })

  it('should return true due to having a value', () => {
    const hasValue = checkHasValue(' ', ['isValue'])
    assert.equal(hasValue, true)
  })
})
