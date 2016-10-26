import getFormFields from './getFormFields'

export default function isValidForm (form) {
  const formFields = getFormFields(form)

  return Object.keys(formFields).reduce((isValid, formFieldKey) => {
    if (!isValid) {
      return false
    }

    return formFields[formFieldKey].isValid
  }, true)
}
