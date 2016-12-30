import runValidation from '../utils/runValidation'

export default function validateFieldFactory (fieldPath) {
  function validateField ({state, resolveArg}) {
    let path

    if (typeof fieldPath === 'string') {
      console.warn('DEPRECATION: Cerebral Forms now requires STATE TAG to be passed into validateField factory')
      path = fieldPath
    } else {
      if (!resolveArg.isTag(fieldPath, 'state')) {
        throw new Error('Cerebral Forms - validateField factory requires a STATE TAG')
      }

      path = resolveArg.path(fieldPath)
    }

    const fieldPathAsArray = path.split('.')
    const formPath = fieldPathAsArray.slice().splice(0, fieldPathAsArray.length - 1)
    const field = state.get(path)
    const form = state.get(formPath)
    const validationResult = runValidation(field, form)

    let dependentFields = []
    if (Array.isArray(field.dependsOn)) {
      dependentFields = field.dependsOn
    } else if (field.dependsOn) {
      dependentFields = [field.dependsOn]
    }

    const dependentOfValidationResult = dependentFields.reduce((currentValidationResult, stringPath) => {
      const dependentFieldPath = stringPath.split('.')
      const dependentFormPath = dependentFieldPath.slice().splice(0, dependentFieldPath.length - 1)
      const dependentField = state.get(dependentFieldPath)
      const dependentForm = state.get(dependentFormPath)
      if (!dependentForm || !dependentField) {
        throw new Error(`The path ${stringPath} used with "dependsOn" on field ${fieldPath.join('.')} is not correct, please check it`)
      }

      const dependentValidationResult = runValidation(dependentField, dependentForm)
      state.merge(dependentFieldPath, dependentValidationResult)

      if (currentValidationResult.isValid && !dependentValidationResult.isValid) {
        return Object.assign(currentValidationResult, { isValid: false })
      }

      return currentValidationResult
    }, validationResult)

    state.merge(path, dependentOfValidationResult)
  }

  return validateField
}
