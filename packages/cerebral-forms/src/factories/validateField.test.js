/* eslint-env mocha */
import {Controller} from 'cerebral'
import {state, input} from 'cerebral/tags'
import {form, validateField, changeField} from '..'
import assert from 'assert'

describe('validateField', () => {
  it('should validate field', () => {
    const controller = Controller({
      signals: {
        validateField: [
          validateField('form.name')
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
    controller.getSignal('validateField')()
    assert.equal(controller.getState('form.name.isValid'), true)
  })
  it('should validate field by state tag', () => {
    const controller = Controller({
      signals: {
        validateField: [
          validateField(state`${input`field`}`)
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
    controller.getSignal('validateField')({
      field: 'form.name'
    })
    assert.equal(controller.getState('form.name.isValid'), true)
  })
})
