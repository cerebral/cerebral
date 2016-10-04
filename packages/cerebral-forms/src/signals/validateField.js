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

export default function validateFieldFactory (path) {
  function validateField ({input, state}) {
    const fieldPath = (path || input.field).split('.')
    const formPath = fieldPath.slice().splice(0, fieldPath.length - 1)
    const field = state.get(fieldPath)
    const form = state.get(formPath)

    state.merge(fieldPath, runValidation(fieldPath, field, form))

    let dependentFields = []
    if (Array.isArray(field.dependsOn)) {
      dependentFields = field.dependsOn
    } else if (field.dependsOn) {
      dependentFields = [field.dependsOn]
    }

    dependentFields.forEach((stringPath) => {
      const dependentFieldPath = stringPath.split('.')
      const dependentFormPath = dependentFieldPath.slice().splice(0, dependentFieldPath.length - 1)
      const field = state.get(dependentFieldPath)
      const form = state.get(dependentFormPath)

      if (!form) {
        throw new Error(`The path ${stringPath} used with "dependsOn" on field ${fieldPath.join('.')} is not correct, please check it`)
      }

      state.merge(fieldPath, runValidation(dependentFieldPath, field, form))
    })
  }

  return validateField
}
