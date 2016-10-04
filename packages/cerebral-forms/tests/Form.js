/* eslint-env mocha */
import {Controller} from 'cerebral'
import {form} from '../src'
import assert from 'assert'

describe('form', () => {
  it('should create fields with default state', () => {
    const controller = Controller({
      state: {
        form: form({
          name: {
            value: 'Ben'
          }
        })
      }
    })
    assert.deepEqual(controller.getState(), {
      form: {
        name: {
          value: 'Ben',
          defaultValue: 'Ben',
          validationRules: null,
          isValid: true,
          errorMessage: null,
          errorMessages: [],
          isValueRules: ['isValue'],
          isRequired: false,
          hasValue: true,
          isPristine: true
        }
      }
    })
  })
  it('should validate initial form state', () => {
    const controller = Controller({
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:4'],
            errorMessages: ['Not long enough']
          }
        })
      }
    })
    assert.deepEqual(controller.getState(), {
      form: {
        name: {
          value: 'Ben',
          defaultValue: 'Ben',
          validationRules: ['minLength:4'],
          isValid: false,
          errorMessage: 'Not long enough',
          errorMessages: ['Not long enough'],
          isValueRules: ['isValue'],
          isRequired: false,
          hasValue: true,
          isPristine: true
        }
      }
    })
  })
})
