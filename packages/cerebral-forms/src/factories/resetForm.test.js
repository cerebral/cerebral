/* eslint-env mocha */
import {Controller} from 'cerebral'
import {input} from 'cerebral/operators'
import {form, resetForm, changeField} from '..'
import assert from 'assert'

describe('resetForm', () => {
  it('should reset form', () => {
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
    assert.equal(controller.getState('form.name.value'), 'Ben')
  })
  it('should reset form by input tag', () => {
    const controller = Controller({
      signals: {
        reset: [
          resetForm(input`form`)
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
    controller.getSignal('reset')({
      form: 'form'
    })
    assert.equal(controller.getState('form.name.value'), 'Ben')
  })
})
