import checkHasValue from './checkHasValue'
import validate from './validate'

export default function runValidation (field, form) {
  const isValueRules = field.isValueRules || ['isValue']
  const hasValue = checkHasValue(form, field.value, isValueRules)
  const result = validate(form, field.value, field.validationRules)
  const isValid = result.isValid && (
    (field.isRequired && hasValue) ||
    !field.isRequired
  )

  const validationResult = {
    isValid,
    hasValue: checkHasValue(form, field.value, isValueRules),
    failedRule: result.failedRule
  }

  if (result.errorMessage) {
    validationResult.errorMessage = result.errorMessage
  }

  return validationResult
}
