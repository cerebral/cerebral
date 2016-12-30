import {Tag} from 'cerebral/tags'

function setFactory (pathTemplate, valueTemplate) {
  function set ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const value = valueTemplate instanceof Tag ? valueTemplate.getValue(tagGetters) : valueTemplate

    return firebase.set(firebasePath, value)
      .then(path.success)
      .catch(path.error)
  }

  return set
}

export default setFactory
