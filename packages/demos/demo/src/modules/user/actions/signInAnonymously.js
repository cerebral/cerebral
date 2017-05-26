function signInAnonymously({ firebase, path, state }) {
  return firebase
    .signInAnonymously()
    .then(result => {
      if (result.error) {
        return path.error(result)
      }
      return path.success(result)
    })
    .catch(path.error)
}

export default signInAnonymously
