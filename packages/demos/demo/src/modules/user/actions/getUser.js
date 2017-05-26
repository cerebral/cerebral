function getUser({ firebase, path }) {
  return firebase
    .getUser()
    .then(result => {
      if (result.user) {
        return path.success(result)
      } else {
        return path.error(result)
      }
    })
    .catch(path.error)
}

export default getUser
