/* eslint-env mocha */
import {Controller} from 'cerebral'
import {getInvalidFormFields, form} from '..'
import assert from 'assert'

describe('getFormFields', () => {
  it('should return no fields for form and nested form', () => {
    const controller = Controller({
      state: {
        form: form({
          firstname: {
            value: 'Ben'
          },
          lastname: {
            value: ''
          },
          age: {
            value: 14
          },
          address: form({
            delivery: {
              value: 'Some address'
            }
          })
        })
      }
    })

    let state = controller.getState()
    const fields = getInvalidFormFields(state.form)
    assert.deepEqual(fields, {})
  })

  it('should return lastname for form and nested form due to invalid', () => {
    const controller = Controller({
      state: {
        form: form({
          firstname: {
            value: 'Ben'
          },
          lastname: {
            value: '',
            isRequired: true
          },
          age: {
            value: 14
          },
          address: form({
            delivery: {
              value: 'Some address'
            }
          })
        })
      }
    })

    let state = controller.getState()
    const fields = getInvalidFormFields(state.form)
    assert.deepEqual(fields, {
      lastname: {
        value: '',
        isRequired: true,
        defaultValue: '',
        validationRules: null,
        isValid: false,
        validationMessages: [],
        requiredMessage: null,
        errorMessage: null,
        isValueRules: [ 'isValue' ],
        hasValue: false,
        isPristine: true
      }
    })
  })
})
