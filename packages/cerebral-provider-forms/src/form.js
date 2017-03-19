import {compute} from 'cerebral'
import runValidation from './utils/runValidation'
import formToJSON from './helpers/formToJSON'
import getInvalidFormFields from './helpers/getInvalidFormFields'
import getFormFields from './helpers/getFormFields'

function createFields (source, form) {
  return Object.keys(source).reduce((fields, key) => {
    if (source[key] === Object(source[key])) {
      if ('value' in source[key]) {
        fields[key] = new Field(source[key], form)
      } else {
        fields[key] = createFields(source[key], form)
      }
    } else {
      fields[key] = source[key]
    }

    return fields
  }, {})
}

export class Field {
  constructor (field, form) {
    this._form = form
    Object.assign(this, field, {
      isPristine: typeof field.isPristine === 'undefined' ? true : field.isPristine
    })
  }
  _validate () {
    return Object.assign(this, runValidation(this, this._form)).isValid
  }
}

export class Form {
  constructor (form) {
    Object.assign(this, createFields(form, this))
    this.isValid = this._validate()
  }
  _validate () {
    function validate (obj) {
      return Object.keys(obj).reduce((isValid, field) => {
        if (obj[field] instanceof Field) {
          const isFieldValid = obj[field]._validate()

          return isValid ? isFieldValid : false
        } else {
          const areFieldsValid = validate(obj[field])

          return isValid ? areFieldsValid : false
        }
      }, true)
    }

    return validate(this)
  }
  toJSON () {
    return formToJSON(this)
  }
  getInvalidFields () {
    return getInvalidFormFields(this)
  }
  getFields () {
    return getFormFields(this)
  }

}

export default function computedForm (formValueTag) {
  return compute(
    formValueTag,
    (formValue) => {
      if (!formValue || typeof formValue !== 'object') {
        console.warn('Cerebral Forms - Form value did not resolve to an object')
        return {}
      }
      return new Form(formValue)
    }
  )
}
