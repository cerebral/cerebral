import {Tag} from 'cerebral/tags'

function removeFactory (pathTemplate) {
  function remove ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate

    return firebase.remove(firebasePath)
      .then(path.success)
      .catch(path.error)
  }

  return remove
}

export default removeFactory
