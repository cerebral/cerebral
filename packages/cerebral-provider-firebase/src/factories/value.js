function valueFactory (valuePath) {
  function value ({firebase, path, resolveArg}) {
    return firebase.value(resolveArg.value(valuePath))
      .then(path.success)
      .catch(path.error)
  }

  return value
}

export default valueFactory
