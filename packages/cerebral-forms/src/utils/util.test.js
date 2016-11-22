/* eslint-env mocha */
import assert from 'assert'
import checkHasValue from './checkHasValue'

describe('utils', () => {
  it('should return false due to not having a value', () => {
    const hasValue = checkHasValue(null, '', ['isValue'])
    assert.equal(hasValue, false)
  })

  it('should return true due to having a value', () => {
    const hasValue = checkHasValue(null, ' ', ['isValue'])
    assert.equal(hasValue, true)
  })
})
