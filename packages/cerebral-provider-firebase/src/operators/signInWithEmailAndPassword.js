function signInWithEmailAndPasswordFactory (email, password) {
  function signInWithEmailAndPassword ({firebase, path, resolve}) {
    return firebase.signInWithEmailAndPassword(resolve.value(email), resolve.value(password))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithEmailAndPassword
}

export default signInWithEmailAndPasswordFactory
