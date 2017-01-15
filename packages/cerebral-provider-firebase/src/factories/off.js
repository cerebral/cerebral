function offFactory (path, event, signal) {
  function off ({firebase, resolveArg}) {
    firebase.off(resolveArg.value(path), resolveArg.value(event), resolveArg.value(signal))
  }

  return off
}

export default offFactory
