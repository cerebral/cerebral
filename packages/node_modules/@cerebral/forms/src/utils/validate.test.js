/* eslint-env mocha */
import validate from './validate'
import assert from 'assert'

describe('validate', () => {
  it('should return initialValidation when there is no validationRules', () => {
    const result = validate('Ben')
    assert.deepEqual(result, {
      isValid: true,
    })
  })
  it('should validate using validationRules', () => {
    const result = validate('Ben', ['isNumeric'])
    assert.equal(result.isValid, false)
    assert.equal(result.failedRule.name, 'isNumeric')
  })
  it('should validate with multiple rules', () => {
    const result = validate('Ben', ['isNumeric', 'minLength:2'])
    assert.equal(result.isValid, false)
    assert.equal(result.failedRule.name, 'isNumeric')
  })
  it('should return initialValidation when there is no failed rules', () => {
    const result = validate('Ben', ['isValue', 'minLength:2'])
    assert.deepEqual(result, {
      isValid: true,
    })
  })
  it('should validate when validationRule arg is not JSON parsable', () => {
    const result = validate('Ben', ['equals:Ben'])
    assert.deepEqual(result, {
      isValid: true,
    })
  })
})
