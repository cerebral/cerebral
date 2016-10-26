/* eslint-env mocha */
import {Controller} from 'cerebral'
import {formToJSON, form} from '..'
import assert from 'assert'

describe('formToJSON', () => {
  it('should return nested form with only it\'s values', () => {
    const controller = Controller({
      state: {
        form: form({
          name: {
            value: 'Ben'
          },
          age: {
            value: 14
          },
          address: form({
            delivery: {
              value: 'Some address'
            }
          })
        })
      }
    })

    let state = controller.getState()
    assert.deepEqual(formToJSON(state), {
      form: {
        name: 'Ben',
        age: 14,
        address: {
          delivery: 'Some address'
        }
      }
    })
  })

  it('should return values for array of forms', () => {
    const controller = Controller({
      state: {
        forms: [
          form({
            name: {
              value: 'Jane'
            }
          }),
          form({
            name: {
              value: 'Joe'
            }
          })
        ]
      }
    })

    let state = controller.getState()
    assert.deepEqual(formToJSON(state), {
      forms: [
        {
          name: 'Jane'
        },
        {
          name: 'Joe'
        }
      ]
    })
  })
})
