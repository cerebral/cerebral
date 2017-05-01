/* eslint-env mocha */
import {field} from '.'
import assert from 'assert'
import {runCompute} from 'cerebral/test'
import {state} from 'cerebral/tags'
import {Field} from './form'

describe('field', () => {
  it('should not be a valid field due to required', () => {
    let compute = {
      state: {
        form: {
          name: {
            value: '',
            isRequired: true
          }
        }
      }
    }
    const nameField = runCompute(field(state`form.name`), compute)
    assert.equal(nameField.isValid, false)
    assert.equal(nameField.hasValue, false)
  })

  it('should  be a valid field', () => {
    let compute = {
      state: {
        form: {
          name: {
            value: 'Some name',
            isRequired: true
          }
        }
      }
    }
    const nameField = runCompute(field(state`form.name`), compute)
    assert.equal(nameField.isValid, true)
    assert.equal(nameField.value, 'Some name')
    assert.ok(nameField instanceof Field)
  })
})
