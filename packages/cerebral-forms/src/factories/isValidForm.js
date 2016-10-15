import isValidFormHelper from '../helpers/isValidForm'

function isValidFormFactory (formPath) {
  function isValidForm ({state, path}) {
    const form = state.get(formPath)

    if (isValidFormHelper(form)) {
      return path.true()
    }

    return path.false()
  }

  return isValidForm
}

export default isValidFormFactory
