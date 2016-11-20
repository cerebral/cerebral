/* eslint-env mocha */
import {Controller} from 'cerebral'
import {isValidForm, form, validateForm, rules, getInvalidFormFields} from '..'
import assert from 'assert'

describe('isValidFrom', () => {
  it('should return false due to isRequired', () => {
    const controller = Controller({
      state: {
        form: form({
          firstName: {
            value: 'Ben'
          },
          lastName: {
            value: '',
            isRequired: true
          },
          street: {
            value: '',
            isRequired: true
          }
        })
      }
    })

    let state = controller.getState()
    let valid = isValidForm(state.form)
    assert.equal(valid, false)
  })

  it('should return true due to isRequired', () => {
    const controller = Controller({
      state: {
        form: form({
          firstName: {
            value: 'Ben'
          },
          lastName: {
            value: 'Doe',
            isRequired: true
          }
        })
      }
    })

    let state = controller.getState()
    let valid = isValidForm(state.form)
    assert.equal(valid, true)
  })

  it('should return false due to isRequired as factory', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          isValidForm('form'), {
            false: [
              function (context) {
                assert.ok(context)
              }
            ]
          }
        ]
      },
      state: {
        form: form({
          firstName: {
            value: 'Ben'
          },
          lastName: {
            value: '',
            isRequired: true
          }
        })
      }
    })
    controller.getSignal('validateForm')()
  })

  it('should return true due to isRequired as factory', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          isValidForm('form'), {
            true: [
              function (context) {
                assert.ok(context)
              }
            ]
          }
        ]
      },
      state: {
        form: form({
          firstName: {
            value: 'Ben'
          },
          lastName: {
            value: 'Doe',
            isRequired: true
          }
        })
      }
    })
    controller.getSignal('validateForm')()
  })

  it('should return true due to isRequired as factory', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          isValidForm('form'), {
            true: [
              function (context) {
                assert.ok(context)
              }
            ]
          }
        ]
      },
      state: {
        form: form({
          firstName: {
            value: 'Ben'
          },
          lastName: {
            value: 'Doe',
            isRequired: true
          },
          address: form({
            delivery: {
              value: 'Some delivery'
            }
          })
        })
      }
    })
    controller.getSignal('validateForm')()
  })

  it('should add a custom rule and be invalid', () => {
    rules.isFirstUpperCase = (value, form, arg) => {
      return typeof value === 'string' && value[0] === value[0].toUpperCase()
    }

    const controller = Controller({
      state: {
        form: form({
          firstName: {
            value: 'ben',
            validationRules: ['isFirstUpperCase'],
            errorMessages: ['first letter is not uppercase']
          }
        })
      }
    })

    let state = controller.getState()
    let valid = isValidForm(state.form)
    assert.equal(valid, false)
    const fields = getInvalidFormFields(state.form)
    assert.deepEqual(fields, {
      firstName: {
        value: 'ben',
        validationRules: [ 'isFirstUpperCase' ],
        errorMessages: [ 'first letter is not uppercase' ],
        defaultValue: 'ben',
        isValid: false,
        errorMessage: 'first letter is not uppercase',
        isValueRules: [ 'isValue' ],
        isRequired: false,
        hasValue: true,
        isPristine: true
      }
    })
  })

  it('should be invalid', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          validateForm('form')
        ]
      },
      state: {
        form: form({
          firstName: {
            value: 'ben',
            isRequired: true
          },
          lastName: {
            value: 'bensson',
            isRequired: true
          },
          email: {
            value: 's',
            validationRules: ['isEmail']
          }
        })
      }
    })
    controller.getSignal('validateForm')()
    let state = controller.getState()
    assert.equal(state.form.email.isValid, false)
  })
})
