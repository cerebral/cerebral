import {Tag} from 'cerebral/tags'

function pushFactory (path, value) {
  function push ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const pathTemplate = path instanceof Tag ? path.getValue(tagGetters) : path
    const valueTemplate = value instanceof Tag ? value.getValue(tagGetters) : value

    return firebase.push(pathTemplate, valueTemplate)
      .then(path.success)
      .catch(path.error)
  }

  return push
}

export default pushFactory
