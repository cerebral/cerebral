import {convertObjectWithTemplates} from './utils'

function updateFactory (updates) {
  function update ({firebase, path, resolveArg}) {
    return firebase.update(convertObjectWithTemplates(updates, resolveArg))
      .then(path.success)
      .catch(path.error)
  }

  return update
}

export default updateFactory
