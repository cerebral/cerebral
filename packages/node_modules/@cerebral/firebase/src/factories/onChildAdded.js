function onChildAddedFactory(path, signal, options = {}) {
  function onChildAdded({ firebase, resolve }) {
    firebase.onChildAdded(
      resolve.value(path),
      resolve.path(signal),
      resolve.value(options)
    )
  }

  return onChildAdded
}

export default onChildAddedFactory
