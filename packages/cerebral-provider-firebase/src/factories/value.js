function valueFactory (valuePath) {
  function value ({firebase, path, resolve}) {
    return firebase.value(resolve.value(valuePath))
      .then(path.success)
      .catch(path.error)
  }

  return value
}

export default valueFactory
