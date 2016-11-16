/* eslint-env mocha */
import {Controller} from 'cerebral'
import {input} from 'cerebral/operators'
import {form, isValidForm, changeField} from '..'
import assert from 'assert'

describe('isValidForm', () => {
  it('should go down path depending on form valid state', () => {
    let validCount = 0
    let invalidCount = 0
    const controller = Controller({
      signals: {
        isValidForm: [
          isValidForm('form'), {
            true: [() => validCount++],
            false: [() => invalidCount++]
          }
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:3']
          }
        })
      }
    })
    controller.getSignal('isValidForm')()
    assert.equal(validCount, 1)
    controller.getSignal('changeField')({field: 'form.name', value: 'fo'})
    controller.getSignal('isValidForm')()
    assert.equal(invalidCount, 1)
  })
  it('should be able to use input template tag', () => {
    let validCount = 0
    let invalidCount = 0
    const controller = Controller({
      signals: {
        isValidForm: [
          isValidForm(input`form`), {
            true: [() => validCount++],
            false: [() => invalidCount++]
          }
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:3']
          }
        })
      }
    })
    controller.getSignal('isValidForm')({
      form: 'form'
    })
    assert.equal(validCount, 1)
    controller.getSignal('changeField')({field: 'form.name', value: 'fo'})
    controller.getSignal('isValidForm')({
      form: 'form'
    })
    assert.equal(invalidCount, 1)
  })
})
