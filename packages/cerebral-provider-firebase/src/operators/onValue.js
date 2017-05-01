function onValueFactory (path, signal) {
  function onValue ({firebase, resolve}) {
    firebase.onValue(resolve.value(path), resolve.path(signal))
  }

  return onValue
}

export default onValueFactory
