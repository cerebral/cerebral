function signInWithEmailAndPasswordFactory (email, password) {
  function signInWithEmailAndPassword ({firebase, path, resolveArg}) {
    return firebase.signInWithEmailAndPassword(resolveArg.value(email), resolveArg.value(password))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithEmailAndPassword
}

export default signInWithEmailAndPasswordFactory
