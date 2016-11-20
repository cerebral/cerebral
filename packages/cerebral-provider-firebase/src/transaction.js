import {
  createRef
} from './helpers'

export default function transaction (path, transactionFunction) {
  const ref = createRef(path)
  return ref.transaction(transactionFunction)
    .then((result) => ({committed: result.committed, value: result.snapshot.val()}))
    .catch((error) => ({error: error.message}))
}
