import configureField from '../utils/configureField'

function resetObject (form) {
  return Object.keys(form).reduce(function (newForm, key) {
    if (form[key] === Object(form[key])) {
      if (Array.isArray(form[key])) {
        newForm[key] = resetArray(form[key])
      } else if ('value' in form[key]) {
        const newField = Object.keys(form[key]).reduce((newField, fKey) => {
          newField[fKey] = form[key][fKey]
          return newField
        }, {})
        newField.value = newField.defaultValue
        newForm[key] = configureField(form, newField)
      } else {
        newForm[key] = resetObject(form[key])
      }
    }

    return newForm
  }, {})
}

function resetArray (formArray) {
  return formArray.reduce((newFormArray, form, index) => {
    newFormArray[index] = resetObject(form)
    return newFormArray
  }, [])
}

export default function resetFormFactory (formPath) {
  function resetForm ({state, resolveArg}) {
    if (typeof formPath === 'string') {
      console.warn('DEPRECATION: Cerebral Forms now requires STATE TAG to be passed into resetForm factory')

      const form = state.get(formPath)

      state.merge(formPath, resetObject(form))
    } else {
      if (!resolveArg.isTag(formPath, 'state')) {
        throw new Error('Cerebral Forms - isValidForm factory requires a STATE TAG')
      }

      const form = resolveArg.value(formPath)

      state.merge(resolveArg.path(formPath), resetObject(form))
    }
  }

  return resetForm
}
