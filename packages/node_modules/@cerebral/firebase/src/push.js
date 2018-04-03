import { createRef } from './helpers'
import { FirebaseProviderError } from './errors'

export default function push(path, payload) {
  const ref = createRef(path)
  const newItem = ref.push()

  return newItem
    .set(payload)
    .then(() => ({ key: newItem.key }))
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
