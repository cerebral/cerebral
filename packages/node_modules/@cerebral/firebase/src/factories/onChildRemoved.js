function onChildRemovedFactory(path, signal, options = {}) {
  function onChildRemoved({ firebase, resolve }) {
    firebase.onChildRemoved(
      resolve.value(path),
      resolve.path(signal),
      resolve.value(options)
    )
  }

  return onChildRemoved
}

export default onChildRemovedFactory
