function createUserWithEmailAndPasswordFactory (email, password) {
  function createUserWithEmailAndPassword ({firebase, path, resolveArg}) {
    return firebase.createUserWithEmailAndPassword(resolveArg.value(email), resolveArg.value(password))
      .then(path.success)
      .catch(path.error)
  }

  return createUserWithEmailAndPassword
}

export default createUserWithEmailAndPasswordFactory
