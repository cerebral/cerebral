import resetFormHelper from '../helpers/resetForm'

function resetFormFactory (formPath) {
  function resetForm ({state, resolve}) {
    if (!resolve.isTag(formPath, 'state')) {
      throw new Error('Cerebral Forms - isValidForm factory requires a STATE TAG')
    }

    const path = resolve.path(formPath)

    state.set(path, resetFormHelper(state.get(path)))
  }

  return resetForm
}

export default resetFormFactory
