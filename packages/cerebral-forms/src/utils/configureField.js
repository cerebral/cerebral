import checkHasValue from './checkHasValue'
import validate from './validate'

export default function configureField (formData, field) {
  // If not an actual field but a global property or just a namespace
  if (field !== Object(field) || !('value' in field)) {
    return field
  }

  const isValueRules = field.isValueRules || ['isValue']
  const isRequired = field.isRequired || false
  const value = field.value
  const defaultValue = field.defaultValue || value
  const validationRules = field.validationRules || null
  const validationMessages = field.validationMessages || []
  const requiredMessage = field.requiredMessage || null
  const hasValue = checkHasValue(formData, value, isValueRules)
  const validationResult = validate(formData, value, validationRules)

  field.defaultValue = defaultValue
  field.validationRules = validationRules
  // Field is valid only when there is a value and the validation rule
  // says it is valid. If "isRequired" it will only be valid if it actually
  // has a value
  field.isValid = ((hasValue && validationResult.isValid) || (!isRequired && !hasValue))
  field.validationMessages = validationMessages
  field.requiredMessage = requiredMessage
  if (isRequired && !hasValue) {
    field.errorMessage = requiredMessage
  } else {
    field.errorMessage = validationResult.isValid ? null : validationMessages[validationResult.failedRuleIndex]
  }
  field.isValueRules = isValueRules
  field.isRequired = isRequired
  field.hasValue = hasValue
  field.isPristine = true

  return field
}
