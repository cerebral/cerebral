function pushFactory (pushPath, value) {
  function push ({firebase, path, resolve}) {
    return firebase.push(resolve.value(pushPath), resolve.value(value))
      .then(path.success)
      .catch(path.error)
  }

  return push
}

export default pushFactory
