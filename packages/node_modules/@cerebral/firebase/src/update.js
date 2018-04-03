import { createRef, noop as noReturnValue } from './helpers'
import { FirebaseProviderError } from './errors'

export default function update(path, payload) {
  const ref = createRef(path)

  return ref
    .update(
      Object.keys(payload).reduce((convertedPayload, key) => {
        convertedPayload[key.replace(/\./g, '/')] = payload[key]

        return convertedPayload
      }, {})
    )
    .then(noReturnValue)
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
