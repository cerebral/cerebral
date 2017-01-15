function setFactory (setPath, value) {
  function set ({firebase, path, resolve}) {
    return firebase.set(resolve.value(setPath), resolve.value(value))
      .then(path.success)
      .catch(path.error)
  }

  return set
}

export default setFactory
