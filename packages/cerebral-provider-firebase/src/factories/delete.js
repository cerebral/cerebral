import {Tag} from 'cerebral/tags'

function deleteFactory (pathTemplate, fileTemplate) {
  function deleteOp ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const file = fileTemplate instanceof Tag ? fileTemplate.getValue(tagGetters) : fileTemplate

    return firebase.delete(firebasePath, file)
      .then(path.success)
      .catch(path.error)
  }

  return deleteOp
}

export default deleteFactory
