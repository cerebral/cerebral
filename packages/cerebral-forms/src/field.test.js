/* eslint-env mocha */
import {Controller} from 'cerebral'
import {form} from '.'
import assert from 'assert'
import changeField from './chains/changeField'

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

  it('should update dependsOn', () => {
    const controller = Controller({
      state: {
        form: form({
          password: {
            value: '',
            isRequired: true,
            requiredMessage: 'Password is required.',
            validationRules: [
              'minLength:15'
            ],
            errorMessages: [
              'Password must be at least 15 characters.'
            ],
            dependsOn: 'form.repeatPassword'
          },
          repeatPassword: {
            value: '',
            isRequired: true,
            validationRules: [
              'equalsField:password'
            ],
            errorMessages: [
              'Password must match repeat password.'
            ],
            requiredMessage: 'Repeat password is required.',
            dependsOn: 'form.password'
          }
        })
      },
      signals: {
        fieldChanged: changeField
      }
    })
    controller.getSignal('fieldChanged')({field: 'form.password', value: 'abcdefghijklmnopqrstuvxyz'})
    assert.equal(controller.getState('form.password.isValid'), false)
    assert.equal(controller.getState('form.repeatPassword.isValid'), false)
    controller.getSignal('fieldChanged')({field: 'form.repeatPassword', value: 'abcdefghijklmnopqrstuvxyz'})
    assert.equal(controller.getState('form.password.isValid'), true)
    assert.equal(controller.getState('form.repeatPassword.isValid'), true)
  })
})
