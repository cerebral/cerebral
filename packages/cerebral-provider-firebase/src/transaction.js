import {
  createRef
} from './helpers'

export default function transaction (path, transactionFunction) {
  const ref = createRef(path)
  return new Promise((resolve, reject) => {
    ref.transaction(transactionFunction)
    .then(
      (result) => resolve({committed: result.committed, value: result.snapshot.val()}),
      (error) => reject({error: error.message})
    )
  })
}
