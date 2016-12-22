import {Tag} from 'cerebral/tags'
import configureField from '../utils/configureField'

function resetObject (form) {
  return Object.keys(form).reduce(function (newForm, key) {
    if (form[key] === Object(form[key])) {
      if (Array.isArray(form[key])) {
        newForm[key] = resetArray(form[key])
      } else if ('value' in form[key]) {
        const newField = Object.keys(form[key]).reduce((newField, fKey) => {
          newField[fKey] = form[key][fKey]
          return newField
        }, {})
        newField.value = newField.defaultValue
        newForm[key] = configureField(form, newField)
      } else {
        newForm[key] = resetObject(form[key])
      }
    }

    return newForm
  }, {})
}

function resetArray (formArray) {
  return formArray.reduce((newFormArray, form, index) => {
    newFormArray[index] = resetObject(form)
    return newFormArray
  }, [])
}

export default function resetFormFactory (formPathTemplate) {
  function resetForm ({state, input}) {
    const tagGetters = {state: state.get, input}
    const formPath = formPathTemplate instanceof Tag ? formPathTemplate.getValue(tagGetters) : formPathTemplate
    const form = state.get(formPath)

    state.merge(formPath, resetObject(form))
  }

  return resetForm
}
