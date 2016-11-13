function signIn ({firebase, path, state}) {
  const email = state.get('user.signIn.$email')
  const password = state.get('user.signIn.$password')

  return firebase.signInWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error)
}

export default signIn
