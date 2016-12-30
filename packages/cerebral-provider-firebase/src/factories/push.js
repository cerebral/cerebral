import {Tag} from 'cerebral/tags'

function pushFactory (pathTemplate, valueTemplate) {
  function push ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const value = valueTemplate instanceof Tag ? valueTemplate.getValue(tagGetters) : valueTemplate

    return firebase.push(firebasePath, value)
      .then(path.success)
      .catch(path.error)
  }

  return push
}

export default pushFactory
