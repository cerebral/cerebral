import {
  createStorageRef
} from './helpers'
import {FirebaseProviderError} from './errors'

export default function deleteOp (path, filename) {
  const ref = createStorageRef(path).child(filename)

  return ref.delete()
    .then(() => undefined)
    .catch((error) => {
      throw new FirebaseProviderError(error.message)
    })
}
