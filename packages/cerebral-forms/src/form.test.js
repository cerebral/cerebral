/* eslint-env mocha */
import {Controller} from 'cerebral'
import {form} from '.'
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
          validationMessages: [],
          requiredMessage: null,
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
            validationMessages: ['Not long enough']
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
          validationMessages: ['Not long enough'],
          requiredMessage: null,
          isValueRules: ['isValue'],
          isRequired: false,
          hasValue: true,
          isPristine: true
        }
      }
    })
  })
  it('should set errorMessage to requiredMessage', () => {
    const controller = Controller({
      state: {
        form: form({
          name: {
            value: '',
            isRequired: true,
            requiredMessage: 'Name is required',
            validationRules: ['minLength:4'],
            validationMessages: ['Not long enough']
          }
        })
      }
    })
    assert.deepEqual(controller.getState(), {
      form: {
        name: {
          value: '',
          defaultValue: '',
          validationRules: ['minLength:4'],
          isValid: false,
          errorMessage: 'Name is required',
          validationMessages: ['Not long enough'],
          requiredMessage: 'Name is required',
          isValueRules: ['isValue'],
          isRequired: true,
          hasValue: false,
          isPristine: true
        }
      }
    })
  })
})
