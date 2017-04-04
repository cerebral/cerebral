import {
  createRef
} from './helpers'
import {FirebaseProviderError} from './errors'

export default function transaction (path, transactionFunction) {
  const ref = createRef(path)

  return ref.transaction(transactionFunction)
    .then((result) => ({committed: result.committed, value: result.snapshot.val()}))
    .catch((error) => {
      throw new FirebaseProviderError(error)
    })
}
