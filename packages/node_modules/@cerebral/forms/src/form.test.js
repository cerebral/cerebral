/* eslint-env mocha */
import assert from 'assert'
import { runCompute } from 'cerebral/test'
import { state } from 'cerebral/tags'
import computedForm, { Form, Field } from './form'

describe('form', () => {
  it('should create fields with default state', () => {
    let compute = {
      state: {
        form: {
          name: {
            value: 'Ben',
          },
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.ok(form instanceof Form)
    assert.ok(form.name instanceof Field)
    assert.equal(form.name.value, 'Ben')
    assert.equal(form.name.isValid, true)
  })
  it('should warn when form value did not resolve to an object', () => {
    const originWarn = console.warn
    console.warn = function(...args) {
      assert.equal(
        args[0],
        'Cerebral Forms - Form value: state`form` did not resolve to an object'
      )
      originWarn.apply(this, args)
      console.warn = originWarn
    }
    let compute = {
      state: {
        form: 'Ben',
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.deepEqual(form, {})
  })
  it('should validate initial form state', () => {
    let compute = {
      state: {
        form: {
          name: {
            value: 'Ben',
            defaultValue: 'Ben',
            validationRules: ['minLength:4'],
          },
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.ok(form instanceof Form)
    assert.ok(form.name instanceof Field)
    assert.equal(form.name.value, 'Ben')
    assert.equal(form.name.isValid, false)
    assert.deepEqual(form.name.validationRules, ['minLength:4'])
    assert.equal(form.name.requiredMessage, null)
    assert.equal(form.name.hasValue, true)
    assert.equal(form.name.isPristine, true)
    assert.equal(form.name.failedRule.name, 'minLength')
    assert.equal(form.name.failedRule.arg, 4)
  })
  it('should allow nested fields', () => {
    let compute = {
      state: {
        form: {
          address: {
            street: {
              value: '',
            },
            zipCode: {
              value: '',
            },
          },
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.ok(form.address.street instanceof Field)
    assert.ok(form.address.zipCode instanceof Field)
    assert.equal(form.isValid, true)
    assert.equal(form.address.street.isValid, true)
    assert.equal(form.address.zipCode.isValid, true)
  })
  it('should allow list of fields', () => {
    let compute = {
      state: {
        form: {
          users: [
            {
              value: '',
            },
            {
              value: '',
            },
          ],
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.ok(form.users[0] instanceof Field)
    assert.ok(form.users[1] instanceof Field)
    assert.equal(form.isValid, true)
    assert.equal(form.users[0].isValid, true)
    assert.equal(form.users[1].isValid, true)
  })
  it('should convert to json', () => {
    let compute = {
      state: {
        form: {
          users: [
            {
              value: 'Ben',
            },
            {
              value: 'Dopey',
            },
          ],
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.deepEqual(form.toJSON(), {
      users: ['Ben', 'Dopey'],
    })
  })
  it('should get invalid fields', () => {
    let compute = {
      state: {
        form: {
          users: [
            {
              value: 'Ben',
              validationRules: ['minLength:5'],
            },
            {
              value: 'Dopey',
            },
          ],
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    const invalidFields = form.getInvalidFields()
    assert.equal(Object.keys(invalidFields)[0], 'users.0')
    assert.equal(invalidFields['users.0'].value, 'Ben')
  })
  it('should work with global props', () => {
    let compute = {
      state: {
        form: {
          name: {
            value: 'Ben',
          },
          showErrors: false,
          validationError: null,
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    assert.ok(form instanceof Form)
    assert.equal(form.showErrors, false)
    assert.equal(form.validationError, null)
  })
  it('should return all fields', () => {
    let compute = {
      state: {
        form: {
          someField: {
            value: 'some field value',
          },
          otherField: {
            value: 'some other field',
          },
        },
      },
    }
    const form = runCompute(computedForm(state`form`), compute)
    const fields = form.getFields()
    assert.equal(fields.someField.value, 'some field value')
    assert.equal(Object.keys(fields).length, 2)
  })
  describe('validate', () => {
    it('should validate using validationRules', () => {
      let compute = {
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['isNumeric'],
            },
          },
        },
      }
      const form = runCompute(computedForm(state`form`), compute)
      assert.equal(form.isValid, false)
    })
    it('should validate with multiple rules', () => {
      let compute = {
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['minLength:2', 'isNumeric'],
            },
          },
        },
      }
      const form = runCompute(computedForm(state`form`), compute)
      assert.equal(form.isValid, false)
      assert.equal(form.name.failedRule.name, 'isNumeric')
      assert.equal(form.name.failedRule.arg, undefined)
    })
    it('should validate required value', () => {
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
      const form = runCompute(computedForm(state`form`), compute)
      assert.equal(form.isValid, false)
    })
    it('should validate required value using custom isValue rule', () => {
      let compute = {
        state: {
          form: {
            someField: {
              value: [],
              isRequired: true,
              isValueRules: ['minLength:1'],
            },
          },
        },
      }
      const form = runCompute(computedForm(state`form`), compute)
      assert.equal(form.isValid, false)
    })
    it('should validate using regexp', () => {
      let compute = {
        state: {
          form: {
            someField: {
              value: 'foo',
              isValueRules: [/foo/],
            },
          },
        },
      }
      const form = runCompute(computedForm(state`form`), compute)
      assert.equal(form.isValid, true)
    })
    it('should validate with global props', () => {
      let compute = {
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['minLength:3'],
            },
            showErrors: false,
            validationError: null,
          },
        },
      }
      const form = runCompute(computedForm(state`form`), compute)
      assert.equal(form.isValid, true)
    })
  })
})
