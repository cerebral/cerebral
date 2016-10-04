import checkHasValue from './checkHasValue'
import validate from './validate'

export default function configureField (formData, field) {
  // If not an actual field, just a namespace
  if (!('value' in field)) {
    return field
  }

  const isValueRules = field.isValueRules || ['isValue']
  const isRequired = field.isRequired || false
  const value = field.value
  const defaultValue = field.defaultValue || value
  const validationRules = field.validationRules || null
  const errorMessages = field.errorMessages || []
  const hasValue = checkHasValue(formData, value, isValueRules)
  const validationResult = validate(formData, value, validationRules)

  field.value = value
  field.defaultValue = defaultValue
  field.validationRules = validationRules
  field.isValid = ((isRequired && hasValue && validationResult.isValid) || (!isRequired && validationResult.isValid))
  field.errorMessages = errorMessages
  field.errorMessage = validationResult.isValid ? null : errorMessages[validationResult.failedRuleIndex]
  field.isValueRules = isValueRules
  field.isRequired = isRequired
  field.hasValue = hasValue
  field.isPristine = true

  return field
}
