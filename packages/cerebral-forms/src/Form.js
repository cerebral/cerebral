import configureField from './utils/configureField.js'

export default function Form (formData) {
  return Object.keys(formData).reduce((form, key) => {
    form[key] = configureField(formData, formData[key])

    return form
  }, {})
}
