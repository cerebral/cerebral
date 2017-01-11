import isValidFormHelper from '../helpers/isValidForm'

function isValidFormFactory (formPath) {
  function isValidForm ({state, path, resolveArg}) {
    if (typeof formPath === 'string') {
      console.warn('DEPRECATION: Cerebral Forms now requires STATE TAG to be passed into isValidForm factory')

      const form = state.get(formPath)

      if (isValidFormHelper(form)) {
        return path.true()
      }

      return path.false()
    } else {
      if (!resolveArg.isTag(formPath, 'state')) {
        throw new Error('Cerebral Forms - isValidForm factory requires a STATE TAG')
      }

      const form = resolveArg.value(formPath)

      if (isValidFormHelper(form)) {
        return path.true()
      }

      return path.false()
    }
  }

  return isValidForm
}

export default isValidFormFactory
