function offFactory(path, event) {
  function off({ firebase, resolve }) {
    firebase.off(resolve.value(path), resolve.value(event))
  }

  return off
}

export default offFactory
