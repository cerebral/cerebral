import {convertObjectWithTemplates} from './utils'

function updateFactory (updates) {
  function update ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}

    return firebase.update(convertObjectWithTemplates(updates, tagGetters))
      .then(path.success)
      .catch(path.error)
  }

  return update
}

export default updateFactory
