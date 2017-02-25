function signInAnonymouslyFactory () {
  function signInAnonymously ({firebase, path}) {
    return firebase.signInAnonymously()
      .then(path.success)
      .catch(path.error)
  }

  return signInAnonymously
}

export default signInAnonymouslyFactory
