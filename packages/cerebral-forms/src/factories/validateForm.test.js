/* eslint-env mocha */
import {Controller} from 'cerebral'
import {state, input} from 'cerebral/tags'
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
  it('should validate form by state tag', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          validateForm(state`${input`form`}`)
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
  it('should validate nested forms', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          validateForm(state`${input`form`}`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:4']
          },
          address: form({
            street: {
              value: '21',
              validationRules: ['minLength:4']
            }
          })
        })
      }
    })
    assert.equal(controller.getState('form.name.isValid'), false)
    assert.equal(controller.getState('form.address.street.isValid'), false)
    controller.getSignal('changeField')({field: 'form.name', value: 'Longer name'})
    controller.getSignal('changeField')({field: 'form.address.street', value: '21 2nd Street'})
    controller.getSignal('validateForm')({
      form: 'form'
    })
    assert.equal(controller.getState('form.name.isValid'), true)
    assert.equal(controller.getState('form.address.street.isValid'), true)
  })
  it('should validate nested form arrays', () => {
    const controller = Controller({
      signals: {
        validateForm: [
          validateForm(state`${input`form`}`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: 'Ben',
            validationRules: ['minLength:4']
          },
          address: [
            form({
              street: {
                value: '21',
                validationRules: ['minLength:4']
              }
            }),
            form({
              street: {
                value: '31 3nd Street',
                validationRules: ['minLength:4']
              }
            })
          ]

        })
      }
    })
    assert.equal(controller.getState('form.name.isValid'), false)
    assert.equal(controller.getState('form.address.0.street.isValid'), false)
    assert.equal(controller.getState('form.address.1.street.isValid'), true)
    controller.getSignal('changeField')({field: 'form.name', value: 'Longer name'})
    controller.getSignal('changeField')({field: 'form.address.0.street', value: '21 2nd Street'})
    controller.getSignal('validateForm')({
      form: 'form'
    })
    assert.equal(controller.getState('form.name.isValid'), true)
    assert.equal(controller.getState('form.address.0.street.isValid'), true)
    assert.equal(controller.getState('form.address.1.street.isValid'), true)
  })
})
