/* eslint-env mocha */
import getInvalidFormFields from './getInvalidFormFields'
import assert from 'assert'

describe('getFormFields', () => {
  it('should return no fields for form and nested form', () => {
    const fields = getInvalidFormFields({
      firstname: {
        value: 'Ben',
        isValid: true,
      },
      lastname: {
        value: '',
        isValid: true,
      },
      age: {
        value: 14,
        isValid: true,
      },
      address: {
        delivery: {
          value: 'Some address',
          isValid: true,
        },
      },
    })
    assert.deepEqual(fields, {})
  })

  it('should return lastname for form and nested form due to invalid', () => {
    const fields = getInvalidFormFields({
      firstname: {
        value: 'Ben',
        isValid: true,
      },
      lastname: {
        value: '',
        isRequired: true,
        isValid: false,
      },
      age: {
        value: 14,
        isValid: true,
      },
      address: {
        delivery: {
          value: 'Some address',
          isValid: true,
        },
      },
    })
    assert.deepEqual(fields, {
      lastname: {
        value: '',
        isRequired: true,
        isValid: false,
      },
    })
  })
})
