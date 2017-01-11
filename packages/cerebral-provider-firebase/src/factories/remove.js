function removeFactory (removePath) {
  function remove ({firebase, path, resolveArg}) {
    return firebase.remove(resolveArg.value(removePath))
      .then(path.success)
      .catch(path.error)
  }

  return remove
}

export default removeFactory
