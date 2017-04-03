import {
  createRef,
  noop as noReturnValue
} from './helpers'
import {FirebaseProviderError} from './errors'

export default function set (path, payload) {
  const ref = createRef(path)

  return ref.set(payload)
    .then(noReturnValue)
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
