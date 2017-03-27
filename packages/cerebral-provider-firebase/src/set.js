import {
  createRef
} from './helpers'
import {FirebaseProviderError} from './errors'

export default function set (path, payload) {
  const ref = createRef(path)

  return ref.set(payload)
    .then(() => undefined)
    .catch((error) => {
      throw new FirebaseProviderError(error.message)
    })
}
