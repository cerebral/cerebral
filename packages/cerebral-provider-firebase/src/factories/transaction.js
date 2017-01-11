function transactionFactory (transactionPath, transactionFunction) {
  function transaction ({firebase, path, resolveArg}) {
    return firebase.transaction(resolveArg.value(transactionPath), transactionFunction)
      .then(path.success)
      .catch(path.error)
  }

  return transaction
}

export default transactionFactory
