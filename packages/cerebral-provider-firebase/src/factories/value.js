import {Tag} from 'cerebral/tags'

function valueFactory (pathTemplate) {
  function value ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate

    return firebase.value(firebasePath)
      .then(path.success)
      .catch(path.error)
  }

  return value
}

export default valueFactory
