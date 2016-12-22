import {Tag} from 'cerebral/tags'
import isValidFormHelper from '../helpers/isValidForm'

function isValidFormFactory (formPathTemplate) {
  function isValidForm ({state, input, path}) {
    const tagGetters = {state: state.get, input}
    const formPath = formPathTemplate instanceof Tag ? formPathTemplate.getValue(tagGetters) : formPathTemplate
    const form = state.get(formPath)

    if (isValidFormHelper(form)) {
      return path.true()
    }

    return path.false()
  }

  return isValidForm
}

export default isValidFormFactory
