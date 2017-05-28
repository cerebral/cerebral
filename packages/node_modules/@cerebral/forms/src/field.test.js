/* eslint-env mocha */
import { field } from '.'
import assert from 'assert'
import { runCompute } from 'cerebral/test'
import { state } from 'cerebral/tags'
import { Field } from './form'

describe('field', () => {
  it('should not be a valid field due to required', () => {
    let compute = {
      state: {
        form: {
          name: {
            value: '',
            isRequired: true,
          },
        },
      },
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
            isRequired: true,
          },
        },
      },
    }
    const nameField = runCompute(field(state`form.name`), compute)
    assert.equal(nameField.isValid, true)
    assert.equal(nameField.value, 'Some name')
    assert.ok(nameField instanceof Field)
  })
  it('should warn when field value did not resolve to an object', () => {
    const originWarn = console.warn
    console.warn = function(...args) {
      assert.equal(
        args[0],
        'Cerebral Forms - Field value: state`form.name` did not resolve to an object'
      )
      originWarn.apply(this, args)
      console.warn = originWarn
    }
    let compute = {
      state: {
        form: {
          name: 'Some name',
        },
      },
    }
    const nameField = runCompute(field(state`form.name`), compute)
    assert.deepEqual(nameField, {})
  })
})
