import resetFormHelper from '../helpers/resetForm'

function resetFormFactory(formPath) {
  function resetForm({ state, resolve }) {
    if (!resolve.isTag(formPath, 'state')) {
      throw new Error(
        'Cerebral Forms - operator.resetForm: You have to use the STATE TAG as an argument'
      )
    }

    const path = resolve.path(formPath)

    state.set(path, resetFormHelper(state.get(path)))
  }

  return resetForm
}

export default resetFormFactory
