import {convertObjectWithTemplates} from './utils'

function updateFactory (updates) {
  function update ({firebase, path, resolve}) {
    return firebase.update(convertObjectWithTemplates(updates, resolve))
      .then(path.success)
      .catch(path.error)
  }

  return update
}

export default updateFactory
