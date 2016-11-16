import validate from '../utils/validate'
import checkHasValue from '../utils/checkHasValue'

function runValidation (fieldPath, field, form) {
  const hasValue = checkHasValue(form, field.value, field.isValueRules)
  const result = validate(form, field.value, field.validationRules)
  const isValid = result.isValid && (
    (field.isRequired && hasValue) ||
    !field.isRequired
  )

  return {
    isValid,
    isPristine: false,
    hasValue: checkHasValue(form, field.value, field.isValueRules),
    errorMessage: result.isValid ? null : field.errorMessages[result.failedRuleIndex]
  }
}

export default function validateFieldFactory (pathTemplate) {
  function validateField (context) {
    const path = typeof pathTemplate === 'function' ? pathTemplate(context).value : pathTemplate
    const fieldPath = path.split('.')
    const formPath = fieldPath.slice().splice(0, fieldPath.length - 1)
    const field = context.state.get(fieldPath)
    const form = context.state.get(formPath)
    const validationResult = runValidation(fieldPath, field, form)

    context.state.merge(fieldPath, validationResult)

    let dependentFields = []
    if (Array.isArray(field.dependsOn)) {
      dependentFields = field.dependsOn
    } else if (field.dependsOn) {
      dependentFields = [field.dependsOn]
    }

    const depententOfValidationResult = dependentFields.reduce((currentValidationResult, stringPath) => {
      const dependentFieldPath = stringPath.split('.')
      const dependentFormPath = dependentFieldPath.slice().splice(0, dependentFieldPath.length - 1)
      const field = context.state.get(dependentFieldPath)
      const form = context.state.get(dependentFormPath)

      if (!form) {
        throw new Error(`The path ${stringPath} used with "dependsOn" on field ${fieldPath.join('.')} is not correct, please check it`)
      }

      const dependentValidationResult = runValidation(dependentFieldPath, field, form)
      context.state.merge(dependentFieldPath, dependentValidationResult)

      if (currentValidationResult.isValid && !dependentValidationResult.isValid) {
        return dependentValidationResult
      }

      return currentValidationResult
    }, validationResult)

    context.state.merge(fieldPath, depententOfValidationResult)
  }

  return validateField
}
