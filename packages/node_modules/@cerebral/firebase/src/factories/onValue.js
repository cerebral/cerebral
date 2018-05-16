function onValueFactory(path, signal, options = {}) {
  function onValue({ firebase, resolve }) {
    firebase.onValue(
      resolve.value(path),
      resolve.path(signal),
      resolve.value(options)
    )
  }

  return onValue
}

export default onValueFactory
