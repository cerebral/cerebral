/* eslint-env mocha */
import {Controller} from 'cerebral'
import {input} from 'cerebral/operators'
import {form, validateForm, changeField} from '..'
import assert from 'assert'

describe('validateField', () => {
  it('should validate field', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          validateForm('form')
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:4']
          }
        })
      }
    })
    assert.equal(controller.getState('form.name.isValid'), false)
    controller.getSignal('changeField')({field: 'form.name', value: 'Longer name'})
    controller.getSignal('validateForm')()
    assert.equal(controller.getState('form.name.isValid'), true)
  })
  it('should validate form by input tag', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          validateForm(input`form`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:4']
          }
        })
      }
    })
    assert.equal(controller.getState('form.name.isValid'), false)
    controller.getSignal('changeField')({field: 'form.name', value: 'Longer name'})
    controller.getSignal('validateForm')({
      form: 'form'
    })
    assert.equal(controller.getState('form.name.isValid'), true)
  })
})
