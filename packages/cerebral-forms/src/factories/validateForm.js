import runValidation from '../utils/runValidation'

export default function validateFormFactory (formPath) {
  function validateForm ({state, input, resolveArg}) {
    function validate (path, form) {
      Object.keys(form).forEach(function (key) {
        if (form[key] === Object(form[key])) {
          if (Array.isArray(form[key])) {
            validateArray(path.concat(key), form[key])
          } else if ('value' in form[key]) {
            state.merge(path.concat(key), runValidation(form[key], form))
          } else {
            validate(path.concat(key), form[key])
          }
        }
      })
    }

    function validateArray (path, formArray) {
      formArray.forEach((form, index) => {
        validate(path.concat(index), form)
      })
    }
    if (typeof formPath === 'string') {
      console.warn('DEPRECATION: Cerebral Forms now requires STATE TAG to be passed into validateForm factory')
      validate(formPath.split('.'), state.get(formPath))
    } else {
      if (!resolveArg.isTag(formPath, 'state')) {
        throw new Error('Cerebral Forms - validateField factory requires a STATE TAG')
      }

      validate(resolveArg.path(formPath).split('.'), resolveArg.value(formPath))
    }
  }

  return validateForm
}
