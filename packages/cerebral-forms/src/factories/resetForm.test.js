/* eslint-env mocha */
import {Controller} from 'cerebral'
import {state, input} from 'cerebral/tags'
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
  it('should reset form by state tag', () => {
    const controller = Controller({
      signals: {
        reset: [
          resetForm(state`${input`form`}`)
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
  it('Should reset nested Form', () => {
    const controller = Controller({
      signals: {
        reset: [
          resetForm(state`${input`form`}`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: ''
          },
          address: form({
            street: {
              value: ''
            }
          })
        })
      }
    })
    controller.getSignal('changeField')({field: 'form.address.street', value: '21 2nd Street'})
    controller.getSignal('reset')({
      form: 'form'
    })
    assert.equal(controller.getState('form.address.street.value'), '')
  })
  it('Should reset nested form arrays', () => {
    const controller = Controller({
      signals: {
        reset: [
          resetForm(state`${input`form`}`, input`initialValues`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: ''
          },
          address: [
            form({
              street: {
                value: ''
              }
            }),
            form({
              street: {
                value: '31 3nd Street'
              }
            })
          ]
        })
      }
    })
    controller.getSignal('changeField')({field: 'form.address.0.street', value: '21 2nd Street'})
    controller.getSignal('changeField')({field: 'form.address.1.street', value: ''})
    controller.getSignal('changeField')({field: 'form.name', value: 'Ben'})
    controller.getSignal('reset')({
      form: 'form'
    })
    assert.equal(controller.getState('form.name.value'), '')
    assert.equal(controller.getState('form.address.0.street.value'), '')
    assert.equal(controller.getState('form.address.1.street.value'), '31 3nd Street')
  })
})
