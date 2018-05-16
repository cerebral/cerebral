import { createReturnPromise } from '../helpers'

function transactionFactory(transactionPath, transactionFunction) {
  function transaction({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.transaction(resolve.value(transactionPath), transactionFunction),
      path
    )
  }

  return transaction
}

export default transactionFactory
