import runValidation from './runValidation'

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

  field.defaultValue = defaultValue
  field.validationRules = validationRules
  // Field is valid only when there is a value and the validation rule
  // says it is valid. If "isRequired" it will only be valid if it actually
  // has a value
  field.validationMessages = validationMessages
  field.requiredMessage = requiredMessage
  field.isValueRules = isValueRules
  field.isRequired = isRequired

  const validationResult = runValidation(field, formData)

  field.isValid = validationResult.isValid
  field.errorMessage = validationResult.errorMessage
  field.hasValue = validationResult.hasValue
  field.isPristine = true

  return field
}
