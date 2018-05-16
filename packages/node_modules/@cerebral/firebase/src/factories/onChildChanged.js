function onChildChangedFactory(path, signal, options = {}) {
  function onChildChanged({ firebase, resolve }) {
    firebase.onChildChanged(
      resolve.value(path),
      resolve.path(signal),
      resolve.value(options)
    )
  }

  return onChildChanged
}

export default onChildChangedFactory
