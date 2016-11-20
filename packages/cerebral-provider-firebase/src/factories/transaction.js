function transactionFactory (path, transactionFunction) {
  function transaction (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path

    return context.firebase.transaction(pathTemplate, transactionFunction)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return transaction
}

export default transactionFactory
