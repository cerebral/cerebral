function getUser ({firebase, path}) {
  return firebase.getUser()
    .then(path.success)
    .catch(path.error)
}

export default getUser
