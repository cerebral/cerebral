/* eslint-env mocha */
import {Controller} from 'cerebral'
import {form} from '../src'
import assert from 'assert'

describe('field', () => {
  it('should create new field by merging form', () => {
    const controller = Controller({
      state: {
        form: form({
          name: {
            value: 'Ben'
          }
        })
      },
      signals: {
        fieldAdded: [({state}) => {
          state.merge('form', form({
            age: {
              value: 18,
              validationRules: ['isNumeric']
            }
          }))
        }]
      }
    })
    controller.getSignal('fieldAdded')()
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
        },
        age: {
          value: 18,
          defaultValue: 18,
          validationRules: ['isNumeric'],
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
})
