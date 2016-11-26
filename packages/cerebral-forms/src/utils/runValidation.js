import checkHasValue from './checkHasValue'
import validate from './validate'

export default function runValidation (field, form) {
  const hasValue = checkHasValue(form, field.value, field.isValueRules)
  const result = validate(form, field.value, field.validationRules)
  const isValid = result.isValid && (
    (field.isRequired && hasValue) ||
    !field.isRequired
  )
  const errorMessage = field.isRequired && !hasValue
    ? field.requiredMessage
    : result.isValid
        ? null
        : field.validationMessages[result.failedRuleIndex]

  return {
    isValid,
    isPristine: false,
    hasValue: checkHasValue(form, field.value, field.isValueRules),
    errorMessage: errorMessage
  }
}
