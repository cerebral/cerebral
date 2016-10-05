import configureField from '../utils/configureField'

function resetObject (form) {
  return Object.keys(form).reduce(function (newForm, key) {
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
  function resetForm ({state}) {
    const form = state.get(formPath)

    state.set(formPath, resetObject(form))
  }

  return resetForm
}
