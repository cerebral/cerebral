/* eslint-env mocha */
import { Controller, Module } from 'cerebral'
import { state } from 'cerebral/tags'
import { set } from 'cerebral/operators'
import isValidForm from './isValidForm'
import FormsProvider from '../'
import assert from 'assert'

describe('isValidForm', () => {
  it('should go down path depending on form valid state', () => {
    let validCount = 0
    let invalidCount = 0
    const controller = Controller(
      Module({
        providers: { forms: FormsProvider() },
        signals: {
          isValidForm: [
            isValidForm(state`form`),
            {
              true: [() => validCount++],
              false: [() => invalidCount++],
            },
          ],
          changeField: [set(state`form.name.value`, 'B')],
        },
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['minLength:3'],
            },
          },
        },
      })
    )
    controller.getSignal('isValidForm')()
    assert.equal(validCount, 1)
    controller.getSignal('changeField')()
    controller.getSignal('isValidForm')()
    assert.equal(invalidCount, 1)
  })
})
