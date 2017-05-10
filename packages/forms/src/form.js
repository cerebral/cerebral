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
        } else if (obj[field] === Object(obj[field])) {
          const areFieldsValid = validate(obj[field])

          return isValid ? areFieldsValid : false
        } else {
          return isValid
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

export function computedField (fieldValueTag) {
  return compute(
    fieldValueTag,
    (fieldValue) => {
      if (!fieldValue || typeof fieldValue !== 'object') {
        console.warn(`Cerebral Forms - Field value: ${fieldValueTag} did not resolve to an object`)
        return {}
      }
      const field = new Field(fieldValue, null)
      field._validate()
      return field
    }
  )
}

export default function computedForm (formValueTag) {
  return compute(
    formValueTag,
    (formValue) => {
      if (!formValue || typeof formValue !== 'object') {
        console.warn(`Cerebral Forms - Form value: ${formValueTag} did not resolve to an object`)
        return {}
      }
      return new Form(formValue)
    }
  )
}
