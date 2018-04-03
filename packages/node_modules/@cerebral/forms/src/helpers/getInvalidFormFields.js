import getFormFields from './getFormFields'

export default function getInvalidFields(form) {
  const formFields = getFormFields(form)

  return Object.keys(formFields)
    .filter((key) => {
      return !formFields[key].isValid
    })
    .reduce((invalidFields, key) => {
      invalidFields[key] = formFields[key]

      return invalidFields
    }, {})
}
