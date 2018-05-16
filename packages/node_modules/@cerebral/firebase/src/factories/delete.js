import { createReturnPromise } from '../helpers'

function deleteFactory(deletePath, file) {
  function deleteOp({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.delete(resolve.value(deletePath), resolve.value(file)),
      path
    )
  }

  return deleteOp
}

export default deleteFactory
