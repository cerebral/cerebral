function deleteFactory (deletePath, file) {
  function deleteOp ({firebase, path, resolveArg}) {
    return firebase.delete(resolveArg.value(deletePath), resolveArg.value(file))
      .then(path.success)
      .catch(path.error)
  }

  return deleteOp
}

export default deleteFactory
