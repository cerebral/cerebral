function getUserFactory () {
  function getUser ({firebase, path}) {
    return firebase.getUser()
      .then(path.success)
      .catch(path.error)
  }

  return getUser
}

export default getUserFactory
