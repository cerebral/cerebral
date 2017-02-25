function createUserWithEmailAndPasswordFactory (email, password) {
  function createUserWithEmailAndPassword ({firebase, path, resolve}) {
    return firebase.createUserWithEmailAndPassword(resolve.value(email), resolve.value(password))
      .then(path.success)
      .catch(path.error)
  }

  return createUserWithEmailAndPassword
}

export default createUserWithEmailAndPasswordFactory
