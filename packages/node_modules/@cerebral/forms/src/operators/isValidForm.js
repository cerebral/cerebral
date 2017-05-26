import form from '../form'

function isValidFormFactory(formPath) {
  function isValidForm({ state, path, resolve }) {
    const formValue = resolve.value(form(formPath))

    return formValue.isValid ? path.true() : path.false()
  }

  return isValidForm
}

export default isValidFormFactory
