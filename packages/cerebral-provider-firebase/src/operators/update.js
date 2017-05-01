import {createReturnPromise, convertObjectWithTemplates} from '../helpers'

function updateFactory (updates) {
  function update ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.update(convertObjectWithTemplates(updates, resolve)),
      path
    )
  }

  return update
}

export default updateFactory
