/* eslint-env mocha */
import {Controller} from 'cerebral'
import {set, state, input} from 'cerebral/operators'
import {form, validateField, validateForm} from '..'
import assert from 'assert'

describe('validate', () => {
  describe('instantiate', () => {
    it('should validate using validationRules', () => {
      const controller = Controller({
        state: {
          form: form({
            name: {
              value: 'Ben',
              validationRules: ['isNumeric'],
              validationMessages: ['Not a number']
            }
          })
        }
      })
      assert.equal(controller.getState('form.name.isValid'), false)
      assert.equal(controller.getState('form.name.errorMessage'), 'Not a number')
    })
    it('should validate with multiple rules and error messages', () => {
      const controller = Controller({
        state: {
          form: form({
            name: {
              value: 'Ben',
              validationRules: ['minLength:5', 'isNumeric'],
              validationMessages: ['Not long enough', 'Not a number']
            }
          })
        }
      })
      assert.equal(controller.getState('form.name.isValid'), false)
      assert.equal(controller.getState('form.name.errorMessage'), 'Not long enough')
    })
    it('should validate with combined rules', () => {
      const controller = Controller({
        state: {
          form: form({
            name: {
              value: 'Ben',
              validationRules: [{
                minLength: 5,
                isNumeric: true
              }],
              validationMessages: ['Not valid value']
            }
          })
        }
      })
      assert.equal(controller.getState('form.name.isValid'), false)
      assert.equal(controller.getState('form.name.errorMessage'), 'Not valid value')
    })
    it('should validate required value', () => {
      const controller = Controller({
        state: {
          form: form({
            name: {
              value: '',
              isRequired: true
            }
          })
        }
      })
      assert.equal(controller.getState('form.name.isValid'), false)
    })
    it('should validate required value using custom isValue rule', () => {
      const controller = Controller({
        state: {
          form: form({
            someField: {
              value: [],
              isRequired: true,
              isValueRules: ['minLength:1']
            }
          })
        }
      })
      assert.equal(controller.getState('form.someField.isValid'), false)
    })
  })
  describe('validateField', () => {
    it('should validate field', () => {
      const controller = Controller({
        state: {
          form: form({
            name: {
              value: 'Be',
              validationRules: ['minLength:3']
            }
          })
        },
        signals: {
          fieldChanged: [
            set(state`form.name.value`, input`value`),
            validateField('form.name')
          ]
        }
      })
      assert.equal(controller.getState('form.name.isValid'), false)
      controller.getSignal('fieldChanged')({value: 'Ben'})
      assert.equal(controller.getState('form.name.isValid'), true)
    })
    it('should validate depending on other fields', () => {
      const controller = Controller({
        state: {
          form: form({
            firstName: {
              value: '',
              dependsOn: 'form.lastName'
            },
            lastName: {
              value: '',
              isRequired: true
            }
          })
        },
        signals: {
          fieldChanged: [
            set(state`form.firstName.value`, input`value`),
            validateField('form.firstName')
          ]
        }
      })
      assert.equal(controller.getState('form.firstName.isValid'), true)
      controller.getSignal('fieldChanged')({value: 'Ben'})
      assert.equal(controller.getState('form.firstName.isValid'), false)
    })
    it('should validate depending on other fields', () => {
      const controller = Controller({
        state: {
          form: form({
            firstName: {
              value: '',
              dependsOn: 'form.lastName'
            },
            lastName: {
              value: '',
              isRequired: true
            }
          })
        },
        signals: {
          fieldChanged: [
            set(state`form.firstName.value`, input`value`),
            validateField('form.firstName')
          ]
        }
      })
      assert.equal(controller.getState('form.firstName.isValid'), true)
      controller.getSignal('fieldChanged')({value: 'Ben'})
      assert.equal(controller.getState('form.firstName.isValid'), false)
    })
    it('should show correct errorMessages', () => {
      const controller = Controller({
        state: {
          form: form({
            password: {
              value: '',
              validationRules: ['minLength:5'],
              validationMessages: ['Too short'],
              dependsOn: 'form.confirmPassword',
              isRequired: true,
              requiredMessage: 'Password is required'
            },
            confirmPassword: {
              value: '',
              validationRules: ['equalsField:password'],
              validationMessages: ['Not equal to password'],
              isRequired: true,
              requiredMessage: 'You must confirm password'
            }
          })
        },
        signals: {
          fieldChanged: [
            set(state`form.password.value`, input`value1`),
            set(state`form.confirmPassword.value`, input`value2`),
            validateField('form.password'),
            validateField('form.confirmPassword')
          ]
        }
      })
      controller.getSignal('fieldChanged')({value1: 'test', value2: 'otherPassword'})
      assert.equal(controller.getState('form.password.errorMessage'), 'Too short')
      assert.equal(controller.getState('form.confirmPassword.errorMessage'), 'Not equal to password')
      controller.getSignal('fieldChanged')({value1: '', value2: 'otherPassword'})
      assert.equal(controller.getState('form.password.errorMessage'), 'Password is required')
      assert.equal(controller.getState('form.confirmPassword.errorMessage'), 'Not equal to password')
      controller.getSignal('fieldChanged')({value1: 'password', value2: ''})
      assert.equal(controller.getState('form.password.errorMessage'), null)
      assert.equal(controller.getState('form.confirmPassword.errorMessage'), 'You must confirm password')
      controller.getSignal('fieldChanged')({value1: 'password', value2: 'password'})
      assert.equal(controller.getState('form.password.errorMessage'), null)
      assert.equal(controller.getState('form.confirmPassword.errorMessage'), null)
      assert.equal(controller.getState('form.password.isValid'), true)
      assert.equal(controller.getState('form.confirmPassword.isValid'), true)
    })
  })
  describe('validateForm', () => {
    it('should validate form', () => {
      const controller = Controller({
        state: {
          form: form({
            name: {
              value: 'Be',
              validationRules: ['minLength:3']
            }
          })
        },
        signals: {
          fieldChanged: [
            set(state`form.name.value`, input`value`)
          ],
          formSubmitted: [
            validateForm('form')
          ]
        }
      })
      assert.equal(controller.getState('form.name.isValid'), false)
      controller.getSignal('fieldChanged')({value: 'Ben'})
      assert.equal(controller.getState('form.name.isValid'), false)
      controller.getSignal('formSubmitted')()
      assert.equal(controller.getState('form.name.isValid'), true)
    })
  })
})
