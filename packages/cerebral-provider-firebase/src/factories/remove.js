import {Tag} from 'cerebral/tags'

function removeFactory (path) {
  function remove ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path

    return firebase.remove(pathTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return remove
}

export default removeFactory
