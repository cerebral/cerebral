function createUserWithEmailAndPassword ({firebase, path, state}) {
  const email = state.get('user.$signIn.email.value')
  const password = state.get('user.$signIn.password.value')

  // validate
  let validationErrors = {}
  if (email.length === 0) {
    validationErrors.EMAIL_EMPTY = true
  }
  if (password.length === 0) {
    validationErrors.PASSWORD_EMPTY = true
  }

  let invalid = Object.keys(validationErrors)
  if (invalid.length > 0) {
    return path.invalid({validationErrors})
  }

  return firebase.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      if (result.error) {
        return path.error(result)
      }
      return path.success(result)
    })
    .catch(path.error)
}

export default createUserWithEmailAndPassword
