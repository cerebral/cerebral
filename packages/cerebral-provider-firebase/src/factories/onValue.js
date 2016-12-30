function onValueFactory (path, signal) {
  function onValue ({firebase, resolveArg}) {
    firebase.onValue(resolveArg.value(path), resolveArg.value(signal))
  }

  return onValue
}

export default onValueFactory
