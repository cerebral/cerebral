function removeFactory (removePath) {
  function remove ({firebase, path, resolve}) {
    return firebase.remove(resolve.value(removePath))
      .then(path.success)
      .catch(path.error)
  }

  return remove
}

export default removeFactory
