/* eslint-env mocha */
import {Controller} from 'cerebral'
import FormsProvider from '.'
import assert from 'assert'
import {Form, Field} from './form'

describe('form', () => {
  it('should create fields with default state', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          name: {
            value: 'Ben'
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            assert.ok(form instanceof Form)
            assert.ok(form.name instanceof Field)
            assert.equal(form.name.value, 'Ben')
            assert.equal(form.name.isValid, true)
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should validate initial form state', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          name: {
            value: 'Ben',
            defaultValue: 'Ben',
            validationRules: ['minLength:4']
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
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
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should allow nested fields', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          address: {
            street: {
              value: ''
            },
            zipCode: {
              value: ''
            }
          }
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            assert.ok(form.address.street instanceof Field)
            assert.ok(form.address.zipCode instanceof Field)
            assert.equal(form.isValid, true)
            assert.equal(form.address.street.isValid, true)
            assert.equal(form.address.zipCode.isValid, true)
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should allow list of fields', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          users: [{
            value: ''
          }, {
            value: ''
          }]
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            assert.ok(form.users[0] instanceof Field)
            assert.ok(form.users[1] instanceof Field)
            assert.equal(form.isValid, true)
            assert.equal(form.users[0].isValid, true)
            assert.equal(form.users[1].isValid, true)
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should convert to json', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          users: [{
            value: 'Ben'
          }, {
            value: 'Dopey'
          }]
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            assert.deepEqual(form.toJSON(), {
              users: ['Ben', 'Dopey']
            })
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should get invalid fields', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      state: {
        form: {
          users: [{
            value: 'Ben',
            validationRules: ['minLength:5']
          }, {
            value: 'Dopey'
          }]
        }
      },
      signals: {
        test: [
          ({forms}) => {
            const form = forms.get('form')
            const invalidFields = form.getInvalidFields()

            assert.equal(Object.keys(invalidFields)[0], 'users.0')
            assert.equal(invalidFields['users.0'].value, 'Ben')
          }
        ]
      }
    })
    controller.getSignal('test')()
    it('should work with global props', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            name: {
              value: 'Ben'
            },
            showErrors: false,
            validationError: null
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.ok(form instanceof Form)
              assert.equal(form.showErrors, false)
              assert.equal(form.validationError, null)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
  })
  describe('validate', () => {
    it('should validate using validationRules', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['isNumeric']
            }
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.equal(form.isValid, false)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should validate with multiple rules', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['minLength:2', 'isNumeric']
            }
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.equal(form.isValid, false)
              assert.equal(form.name.failedRule.name, 'isNumeric')
              assert.equal(form.name.failedRule.arg, undefined)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should validate required value', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            name: {
              value: '',
              isRequired: true
            }
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.equal(form.isValid, false)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should validate required value using custom isValue rule', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            someField: {
              value: [],
              isRequired: true,
              isValueRules: ['minLength:1']
            }
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.equal(form.isValid, false)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should validate using regexp', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            someField: {
              value: 'foo',
              isValueRules: [/foo/]
            }
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.equal(form.isValid, true)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should return all fields', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            someField: {
              value: 'some field value'
            },
            otherField: {
              value: 'some other field'
            }
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              let fields = form.getFields()
              assert.equal(fields.someField.value, 'some field value')
              assert.equal(Object.keys(fields).length, 2)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
    it('should validate with global props', () => {
      const controller = Controller({
        providers: [FormsProvider()],
        state: {
          form: {
            name: {
              value: 'Ben',
              validationRules: ['isNumeric']
            },
            showErrors: false,
            validationError: null
          }
        },
        signals: {
          test: [
            ({forms}) => {
              const form = forms.get('form')
              assert.equal(form.isValid, false)
            }
          ]
        }
      })
      controller.getSignal('test')()
    })
  })
})
