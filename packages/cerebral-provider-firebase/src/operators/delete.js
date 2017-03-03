function deleteFactory (deletePath, file) {
  function deleteOp ({firebase, path, resolve}) {
    return firebase.delete(resolve.value(deletePath), resolve.value(file))
      .then(path.success)
      .catch(path.error)
  }

  return deleteOp
}

export default deleteFactory
