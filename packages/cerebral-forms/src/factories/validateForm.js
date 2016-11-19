import validate from '../utils/validate'
import checkHasValue from '../utils/checkHasValue'

export default function validateFormFactory (passedFormPathTemplate) {
  function validateForm (context) {
    const passedFormPath = typeof passedFormPathTemplate === 'function' ? passedFormPathTemplate(context).value : passedFormPathTemplate
    const formPath = passedFormPath.split('.')
    const currentPathValue = context.state.get(formPath)

    function validateForm (path, form) {
      Object.keys(form).forEach(function (key) {
        if (Array.isArray(form[key])) {
          validateArray(path.concat(key), form[key])
        } else if ('value' in form[key]) {
          doValidation(path.concat(key), form, key)
        } else {
          validateForm(path.concat(key), form[key])
        }
      })
    }

    function validateArray (path, formArray) {
      formArray.forEach((form, index) => {
        validateForm(path.concat(index), form)
      })
    }

    function doValidation (path, form, key) {
      const field = form[key]
      const hasValue = checkHasValue(form, field.value, field.isValueRules)
      const result = validate(form, field.value, field.validationRules)
      const isValid = result.isValid && (
        (field.isRequired && hasValue) ||
        !field.isRequired
      )

      context.state.merge(path, {
        isValid: isValid,
        hasValue: hasValue,
        errorMessage: isValid ? null : (field.errorMessages && field.errorMessages.length > 0 ? field.errorMessages[result.failedRuleIndex] : null),
        isPristine: false
      })
    }

    validateForm(formPath, currentPathValue)
  }

  return validateForm
}
