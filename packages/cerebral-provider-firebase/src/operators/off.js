function offFactory (path, event, signal) {
  function off ({firebase, resolve}) {
    firebase.off(resolve.value(path), resolve.value(event), resolve.path(signal))
  }

  return off
}

export default offFactory
