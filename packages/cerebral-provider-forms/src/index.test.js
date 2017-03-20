/* eslint-env mocha */
import {Controller} from 'cerebral'
import FormsProvider from '.'
import assert from 'assert'
import rules from './rules'

describe('provider', () => {
  it('should be able to add rules', () => {
    const controller = Controller({
      providers: [
        FormsProvider({
          rules: {
            isBen (value) {
              return value === 'Ben'
            }
          }
        })
      ],
      state: {
        form: {
          name: {
            value: 'Ben',
            validationRules: ['isBen']
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.name.value, 'Ben')
            assert.equal(form.name.isValid, true)
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should be able to update rules', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          name: {
            value: 'Ben',
            validationRules: ['isBen']
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            forms.updateRules({
              isBen (value) {
                return value === 'Ben'
              }
            })
          },
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.name.value, 'Ben')
            assert.equal(form.name.isValid, true)
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should be able to set error messages', () => {
    const controller = Controller({
      providers: [
        FormsProvider({
          errorMessages: {
            minLength (value, minLengthValue) {
              assert.equal(value, 'Be')
              assert.equal(minLengthValue, 3)

              return `is length ${value.length}, should be ${minLengthValue}`
            }
          }
        })
      ],
      state: {
        form: {
          name: {
            value: 'Be',
            validationRules: ['minLength:3']
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.name.value, 'Be')
            assert.equal(form.name.isValid, false)
            assert.equal(form.name.errorMessage, 'is length 2, should be 3')
          }
        ]
      }
    })
    controller.getSignal('test')()
    rules._errorMessages = {}
  })
  it('should be able to update error messages', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          name: {
            value: 'Be',
            validationRules: ['minLength:3']
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            forms.updateErrorMessages({
              minLength (value, minLengthValue) {
                assert.equal(value, 'Be')
                assert.equal(minLengthValue, 3)

                return `is length ${value.length}, should be ${minLengthValue}`
              }
            })
          },
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.name.value, 'Be')
            assert.equal(form.name.isValid, false)
            assert.equal(form.name.errorMessage, 'is length 2, should be 3')
          }
        ]
      }
    })
    controller.getSignal('test')()
    rules._errorMessages = {}
  })
  it('should be able to reset form', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          name: {
            value: 'Be',
            defaultValue: 'Ben',
            validationRules: ['minLength:3']
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            forms.reset('form')
            const form = forms.get('form')
            assert.equal(form.name.value, 'Ben')
            assert.equal(form.name.isValid, true)
          }
        ]
      }
    })
    controller.getSignal('test')()
    rules._errorMessages = {}
  })
  it('should be able to convert to json', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          name: {
            value: 'Be'
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            assert.deepEqual(forms.toJSON('form'), {
              name: 'Be'
            })
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
})
