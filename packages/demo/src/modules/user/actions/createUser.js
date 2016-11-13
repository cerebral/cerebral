function createUser({ firebase, path, state }) {
  const email = state.get('user.signIn.$email')
  const password = state.get('user.signIn.$password')

  return firebase.createUserWithEmailAndPassword(email, password)
    .then(path.success)
    .catch(path.error);
}

export default createUser
