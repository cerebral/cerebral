function pushFactory (pushPath, value) {
  function push ({firebase, path, resolveArg}) {
    return firebase.push(resolveArg.value(pushPath), resolveArg.value(value))
      .then(path.success)
      .catch(path.error)
  }

  return push
}

export default pushFactory
