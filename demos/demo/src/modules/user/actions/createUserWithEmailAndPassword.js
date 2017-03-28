function createUserWithEmailAndPassword ({firebase, path, state}) {
  const email = state.get('user.$signIn.email.value')
  const password = state.get('user.$signIn.password.value')

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
