import {Tag} from 'cerebral/tags'
import runValidation from '../utils/runValidation'

export default function validateFormFactory (passedFormPathTemplate) {
  function validateForm ({state, input}) {
    const tagGetters = {state: state.get, input}
    const passedFormPath = passedFormPathTemplate instanceof Tag ? passedFormPathTemplate.getValue(tagGetters) : passedFormPathTemplate
    const formPath = passedFormPath.split('.')
    const currentPathValue = state.get(formPath)

    function validateForm (path, form) {
      Object.keys(form).forEach(function (key) {
        if (form[key] === Object(form[key])) {
          if (Array.isArray(form[key])) {
            validateArray(path.concat(key), form[key])
          } else if ('value' in form[key]) {
            state.merge(path.concat(key), runValidation(form[key], form))
          } else {
            validateForm(path.concat(key), form[key])
          }
        }
      })
    }

    function validateArray (path, formArray) {
      formArray.forEach((form, index) => {
        validateForm(path.concat(index), form)
      })
    }

    validateForm(formPath, currentPathValue)
  }

  return validateForm
}
