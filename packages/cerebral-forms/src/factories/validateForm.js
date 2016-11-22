import runValidation from '../utils/runValidation'

export default function validateFormFactory (passedFormPathTemplate) {
  function validateForm (context) {
    const passedFormPath = typeof passedFormPathTemplate === 'function' ? passedFormPathTemplate(context).value : passedFormPathTemplate
    const formPath = passedFormPath.split('.')
    const currentPathValue = context.state.get(formPath)

    function validateForm (path, form) {
      Object.keys(form).forEach(function (key) {
        if (Array.isArray(form[key])) {
          validateArray(path.concat(key), form[key])
        } else if ('value' in form[key]) {
          context.state.merge(path.concat(key), runValidation(form[key], form))
        } else {
          validateForm(path.concat(key), form[key])
        }
      })
    }

    function validateArray (path, formArray) {
      formArray.forEach((form, index) => {
        validateForm(path.concat(index), form)
      })
    }

    validateForm(formPath, currentPathValue)
  }

  return validateForm
}
