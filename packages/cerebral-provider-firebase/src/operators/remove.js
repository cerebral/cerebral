import {createReturnPromise} from '../helpers'

function removeFactory (removePath) {
  function remove ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.remove(resolve.value(removePath)),
      path
    )
  }

  return remove
}

export default removeFactory
