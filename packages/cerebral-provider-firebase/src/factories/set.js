function setFactory (setPath, value) {
  function set ({firebase, path, resolveArg}) {
    return firebase.set(resolveArg.value(setPath), resolveArg.value(value))
      .then(path.success)
      .catch(path.error)
  }

  return set
}

export default setFactory
