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

    const depententOfValidationResult = dependentFields.reduce((currentValidationResult, stringPath) => {
      const dependentFieldPath = stringPath.split('.')
      const dependentFormPath = dependentFieldPath.slice().splice(0, dependentFieldPath.length - 1)
      const field = context.state.get(dependentFieldPath)
      const form = context.state.get(dependentFormPath)

      if (!form) {
        throw new Error(`The path ${stringPath} used with "dependsOn" on field ${fieldPath.join('.')} is not correct, please check it`)
      }

      const dependentValidationResult = runValidation(field, form)
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
