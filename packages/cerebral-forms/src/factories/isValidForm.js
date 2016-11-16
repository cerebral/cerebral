import isValidFormHelper from '../helpers/isValidForm'

function isValidFormFactory (formPathTemplate) {
  function isValidForm (context) {
    const formPath = typeof formPathTemplate === 'function' ? formPathTemplate(context).value : formPathTemplate
    const form = context.state.get(formPath)

    if (isValidFormHelper(form)) {
      return context.path.true()
    }

    return context.path.false()
  }

  return isValidForm
}

export default isValidFormFactory
