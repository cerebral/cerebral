/* eslint-env mocha */
import {Controller} from 'cerebral'
import {getFormFields, form} from '../src'
import assert from 'assert'

describe('getFormFields', () => {
  it('should return fields for form and nested form', () => {
    const controller = Controller({
      state: {
        form: form({
          name: {
            value: 'Ben'
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
    const fields = getFormFields(state.form)
    assert.equal(fields.name.value, 'Ben')
    assert.equal(fields.age.value, 14)
    assert.equal(fields['address.delivery'].value, 'Some address')
  })

  it('should return fields for form in array', () => {
    const controller = Controller({
      state: {
        forms: [
          {
            form1: form({
              fields: [
                {
                  name: {
                    value: 'Doe'
                  }
                }
              ],
              name: {
                value: 'Jane Doe'
              }
            })
          },
          form({
            name: {
              value: 'Joe Doe'
            }
          })
        ]
      }
    })

    let state = controller.getState()
    const fields = getFormFields(state.forms)
    assert.deepEqual(fields, {
      '0.form1.name': {
        value: 'Jane Doe',
        defaultValue: 'Jane Doe',
        validationRules: null,
        isValid: true,
        errorMessages: [],
        errorMessage: null,
        isValueRules: [ 'isValue' ],
        isRequired: false,
        hasValue: true,
        isPristine: true
      },
      '0.form1.fields.0.name': {
        value: 'Doe'
      },
      '1.name': {
        value: 'Joe Doe',
        defaultValue: 'Joe Doe',
        validationRules: null,
        isValid: true,
        errorMessages: [],
        errorMessage: null,
        isValueRules: [ 'isValue' ],
        isRequired: false,
        hasValue: true,
        isPristine: true
      }
    })
  })
})
