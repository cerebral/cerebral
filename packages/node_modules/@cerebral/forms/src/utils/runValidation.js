import checkHasValue from './checkHasValue'
import validate from './validate'

export default function runValidation(field, get) {
  const isValueRules = field.isValueRules || ['isValue']
  const hasValue = checkHasValue(field.value, isValueRules, get)
  const result = validate(field.value, field.validationRules, get)
  const isValid =
    result.isValid && ((field.isRequired && hasValue) || !field.isRequired)

  const validationResult = {
    isValid,
    hasValue: checkHasValue(field.value, isValueRules, get),
    failedRule: result.failedRule,
  }

  if (result.errorMessage) {
    validationResult.errorMessage = result.errorMessage
  }

  return validationResult
}
