function sendPasswordResetEmailFactory (email) {
  function sendPasswordResetEmail ({firebase, path, resolve}) {
    return firebase.sendPasswordResetEmail(resolve.value(email))
      .then(path.success)
      .catch(path.error)
  }

  return sendPasswordResetEmail
}

export default sendPasswordResetEmailFactory
