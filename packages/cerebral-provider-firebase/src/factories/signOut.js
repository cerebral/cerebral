function signOutFactory () {
  function signOut ({firebase, path}) {
    return firebase.signOut()
      .then(path.success)
      .catch(path.error)
  }

  return signOut
}

export default signOutFactory
