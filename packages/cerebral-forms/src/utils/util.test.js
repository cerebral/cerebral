/* eslint-env mocha */
import assert from 'assert'
import checkHasValue from './checkHasValue'
import validate from './validate'

describe('utils', () => {
  it('should return false due to not having a value', () => {
    const hasValue = checkHasValue(null, '', ['isValue'])
    assert.equal(hasValue, false)
  })

  it('should return true due to having a value', () => {
    const hasValue = checkHasValue(null, ' ', ['isValue'])
    assert.equal(hasValue, true)
  })

  it('should return an undefined valid because rule does not exists', () => {
    const valid = validate(null, ' ', ['notFound'])
    assert.equal(valid.isValid, undefined)
  })

  it('should return true and not be able to parse json', () => {
    const valid = validate(null, '3,1', ['equals:3,1'])
    assert.equal(valid.isValid, true)
  })
})
