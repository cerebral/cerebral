/* eslint-env mocha */
import {Controller} from 'cerebral'
import {form, resetForm, changeField} from '../src'
import assert from 'assert'

describe('resetForm', () => {
  it('should change the field to Other name', () => {
    const controller = Controller({
      signals: {
        resetForm,
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben'
          }
        })
      }
    })
    controller.getSignal('changeField')({field: 'form.name', value: 'Other name'})
    assert.deepEqual(controller.getState(), {
      form: {
        name: {
          value: 'Other name',
          defaultValue: 'Ben',
          validationRules: null,
          isValid: true,
          errorMessages: [],
          errorMessage: null,
          isValueRules: ['isValue'],
          isRequired: false,
          hasValue: true,
          isPristine: false
        }
      }
    })
  })

  it('should change the field and the resetForm', () => {
    const controller = Controller({
      signals: {
        reset: [
          resetForm('form')
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben'
          }
        })
      }
    })
    controller.getSignal('changeField')({field: 'form.name', value: 'Other name'})
    controller.getSignal('reset')()
    assert.deepEqual(controller.getState(), {
      form: {
        name: {
          value: 'Ben',
          defaultValue: 'Ben',
          validationRules: null,
          isValid: true,
          errorMessages: [],
          errorMessage: null,
          isValueRules: ['isValue'],
          isRequired: false,
          hasValue: true,
          isPristine: true
        }
      }
    })
  })
})
