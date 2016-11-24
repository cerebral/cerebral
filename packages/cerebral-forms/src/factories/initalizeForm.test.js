/* eslint-env mocha */
import {Controller} from 'cerebral'
import {input} from 'cerebral/operators'
import {form, initializeForm, changeField} from '..'
import assert from 'assert'

describe('initializeForm', () => {
  it('should initialize form with data', () => {
    const controller = Controller({
      signals: {
        initialize: [
          initializeForm('form', {
            name: 'Ben'
          })
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: ''
          }
        })
      }
    })
    controller.getSignal('initialize')()
    assert.equal(controller.getState('form.name.value'), 'Ben')
  })
  it('should initialize form by input tag', () => {
    const controller = Controller({
      signals: {
        initialize: [
          initializeForm(input`form`, input`initialValues`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: ''
          }
        })
      }
    })
    controller.getSignal('initialize')({
      form: 'form',
      initialValues: {
        name: 'Ben'
      }
    })
    assert.equal(controller.getState('form.name.value'), 'Ben')
  })
  it('should change defaultValue by input tag', () => {
    const controller = Controller({
      signals: {
        initialize: [
          initializeForm(input`form`, input`initialValues`)
        ],
        changeField
      },
      state: {
        form: form({
          name: {
            value: '',
            defaultValue: 'Tom'
          }
        })
      }
    })
    controller.getSignal('initialize')({
      form: 'form',
      initialValues: {
        name: 'Ben'
      }
    })
    assert.equal(controller.getState('form.name.defaultValue'), 'Ben')
  })
  it('Should support nested forms', () => {
    const controller = Controller({
      signals: {
        initialize: [
          initializeForm(input`form`, input`initialValues`)
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
    controller.getSignal('initialize')({
      form: 'form',
      initialValues: {
        name: 'Ben',
        address: {
          street: '21 2nd Street'
        }
      }
    })
    assert.equal(controller.getState('form.name.value'), 'Ben')
    assert.equal(controller.getState('form.address.street.value'), '21 2nd Street')
  })
  it('Should support nested form arrays', () => {
    const controller = Controller({
      signals: {
        initialize: [
          initializeForm(input`form`, input`initialValues`)
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
            })
          ]
        })
      }
    })

    controller.getSignal('initialize')({
      form: 'form',
      initialValues: {
        name: 'Ben',
        address: [
          { street: '21 2nd Street' },
          { street: '31 3nd Street' }
        ]
      }
    })
    assert.equal(controller.getState('form.name.value'), 'Ben')
    assert.equal(controller.getState('form.address.0.street.value'), '21 2nd Street')
    assert.equal(controller.getState('form.address.1.street.value'), '31 3nd Street')
  })
  it('Should support nested form arrays', () => {
    const controller = Controller({
      signals: {
        initialize: [
          initializeForm(input`form`, input`initialValues`)
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
    controller.getSignal('initialize')({
      form: 'form',
      initialValues: {
        name: 'Ben',
        address: [
          { street: '21 2nd Street' }
        ]
      }
    })
    assert.equal(controller.getState('form.name.value'), 'Ben')
    assert.equal(controller.getState('form.address.0.street.value'), '21 2nd Street')
    assert.equal(controller.getState('form.address.1.street.value'), '31 3nd Street')
  })
})
