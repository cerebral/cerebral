import runValidation from '../utils/runValidation'

export default function validateFieldFactory (pathTemplate) {
  function validateField (context) {
    const path = typeof pathTemplate === 'function' ? pathTemplate(context).value : pathTemplate
    const fieldPath = path.split('.')
    const formPath = fieldPath.slice().splice(0, fieldPath.length - 1)
    const field = context.state.get(fieldPath)
    const form = context.state.get(formPath)
    const validationResult = runValidation(field, form)

    context.state.merge(fieldPath, validationResult)

    let dependentFields = []
    if (Array.isArray(field.dependsOn)) {
      dependentFields = field.dependsOn
    } else if (field.dependsOn) {
      dependentFields = [field.dependsOn]
    }

    const dependentOfValidationResult = dependentFields.reduce((currentValidationResult, stringPath) => {
      const dependentFieldPath = stringPath.split('.')
      const dependentFormPath = dependentFieldPath.slice().splice(0, dependentFieldPath.length - 1)
      const dependentField = context.state.get(dependentFieldPath)
      const dependentForm = context.state.get(dependentFormPath)
      if (!dependentForm || !dependentField) {
        throw new Error(`The path ${stringPath} used with "dependsOn" on field ${fieldPath.join('.')} is not correct, please check it`)
      }

      const dependentValidationResult = runValidation(dependentField, dependentForm)
      context.state.merge(dependentFieldPath, dependentValidationResult)

      if (currentValidationResult.isValid && !dependentValidationResult.isValid) {
        return Object.assign(currentValidationResult, { isValid: false })
      }

      return currentValidationResult
    }, validationResult)

    context.state.merge(fieldPath, dependentOfValidationResult)
  }

  return validateField
}
