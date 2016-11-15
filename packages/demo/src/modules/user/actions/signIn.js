function signIn ({firebase, path, state}) {
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

  return firebase.signInWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error)
}

export default signIn
