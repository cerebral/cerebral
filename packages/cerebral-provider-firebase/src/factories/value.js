import {Tag} from 'cerebral/tags'

function valueFactory (path) {
  function value ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path

    return firebase.value(pathTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return value
}

export default valueFactory
