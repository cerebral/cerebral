import {
  createRef,
  noop as noReturnValue
} from './helpers'
import {FirebaseProviderError} from './errors'

export default function remove (path) {
  const ref = createRef(path)

  return ref.remove()
    .then(noReturnValue)
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
