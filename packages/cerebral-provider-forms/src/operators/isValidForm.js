import form from '../form'

function isValidFormFactory (formPath) {
  function isValidForm ({state, path, resolve}) {
    if (!resolve.isTag(formPath, 'state')) {
      throw new Error('Cerebral Forms - isValidForm factory requires a STATE TAG')
    }

    const formValue = resolve.value(form(formPath))

    return formValue.isValid ? path.true() : path.false()
  }

  return isValidForm
}

export default isValidFormFactory
