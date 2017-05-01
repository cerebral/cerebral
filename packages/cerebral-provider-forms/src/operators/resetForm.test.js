/* eslint-env mocha */
import {Controller} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import resetForm from './resetForm'
import assert from 'assert'
import FormsProvider from '../'

describe('resetForm', () => {
  it('should reset form', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      signals: {
        test: [
          resetForm(state`form`),
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.name.value, 'John')
          }
        ]
      },
      state: {
        form: {
          name: {
            value: 'Ben',
            defaultValue: 'John'
          }
        }
      }
    })
    controller.getSignal('test')()
  })
  it('Should reset nested Form', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      signals: {
        test: [
          set(state`form.address.street.value`, 'woop woop'),
          resetForm(state`form`),
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.address.street.value, '')
          }
        ]
      },
      state: {
        form: {
          name: {
            value: ''
          },
          address: {
            street: {
              value: ''
            }
          }
        }
      }
    })
    controller.getSignal('test')()
  })
  it('Should reset nested form arrays', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      signals: {
        test: [
          set(state`form.address.1.street.value`, 'woop woop'),
          resetForm(state`form`),
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.address[1].street.value, '')
          }
        ]
      },
      state: {
        form: {
          name: {
            value: ''
          },
          address: [
            {
              street: {
                value: ''
              }
            },
            {
              street: {
                value: '31 3nd Street'
              }
            }
          ]
        }
      }
    })
    controller.getSignal('test')()
  })
})
