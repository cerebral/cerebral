import configureField from '../utils/configureField'

function initializeObject (form, initialValues) {
  return Object.keys(form).reduce(function (newForm, key) {
    if (form[key] === Object(form[key])) {
      if (Array.isArray(form[key])) {
        newForm[key] = initializeArray(form[key], initialValues && initialValues[key])
      } else if ('value' in form[key]) {
        const newField = Object.keys(form[key]).reduce((newField, fKey) => {
          newField[fKey] = form[key][fKey]
          return newField
        }, {})
        newField.defaultValue = initialValues && initialValues[key] || newField.defaultValue
        newField.value = newField.defaultValue
        newForm[key] = configureField(form, newField)
      } else {
        newForm[key] = initializeObject(form[key], initialValues && initialValues[key])
      }
    }

    return newForm
  }, {})
}

function initializeArray (formArray, initialValues) {
  if (initialValues && formArray.length < initialValues.length) {
    return initialValues.reduce((newFormArray, value, index) => {
      newFormArray[index] = initializeObject(formArray[index] || formArray[0], value)
      return newFormArray
    }, [])
  }
  return formArray.reduce((newFormArray, form, index) => {
    newFormArray[index] = initializeObject(form, initialValues && initialValues[index])
    return newFormArray
  }, [])
}

export default function initializeFormFactory (formPathTemplate, initialValuesTemplate) {
  function initializeForm (context) {
    const formPath = typeof formPathTemplate === 'function' ? formPathTemplate(context).value : formPathTemplate
    const initialValues = typeof initialValuesTemplate === 'function' ? initialValuesTemplate(context).value : initialValuesTemplate
    const form = context.state.get(formPath)

    context.state.merge(formPath, initializeObject(form, initialValues))
  }

  return initializeForm
}

function resetFormFactory (formPathTemplate) {
  function resetForm (context) {
    const formPath = typeof formPathTemplate === 'function' ? formPathTemplate(context).value : formPathTemplate
    const form = context.state.get(formPath)

    context.state.merge(formPath, initializeObject(form))
  }

  return resetForm
}

export {resetFormFactory as resetForm}
