import {
  createRef
} from './helpers'
import FirebaseProviderError from './FirebaseProviderError'

export default function remove (path) {
  const ref = createRef(path)

  return ref.remove()
    .then(() => undefined)
    .catch((error) => {
      throw new FirebaseProviderError(error.message)
    })
}
