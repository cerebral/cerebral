import {Tag} from 'cerebral/tags'

function setFactory (path, value) {
  function set ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path
    const valueTemplate = value instanceof Tag ? value.getValue(tagGetters) : value

    return firebase.set(pathTemplate, valueTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return set
}

export default setFactory
