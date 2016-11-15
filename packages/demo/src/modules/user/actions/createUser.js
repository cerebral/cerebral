function createUser ({firebase, path, state}) {
  const email = state.get('user.signIn.$email')
  const password = state.get('user.signIn.$password')

  // validate
  let validationsErrors = {}
  if (email.length === 0) {
    validationsErrors.EMAIL_EMPTY = true
  }
  if (password.length === 0) {
    validationsErrors.PASSWORD_EMPTY = true
  }

  let invalid = Object.keys(validationsErrors)
  if (invalid.length > 0) {
    return path.invalid({validationsErrors})
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

export default createUser
