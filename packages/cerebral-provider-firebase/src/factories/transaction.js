function transactionFactory (transactionPath, transactionFunction) {
  function transaction ({firebase, path, resolve}) {
    return firebase.transaction(resolve.value(transactionPath), transactionFunction)
      .then(path.success)
      .catch(path.error)
  }

  return transaction
}

export default transactionFactory
