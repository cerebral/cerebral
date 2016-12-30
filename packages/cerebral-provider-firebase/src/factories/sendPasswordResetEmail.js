function sendPasswordResetEmailFactory (email) {
  function sendPasswordResetEmail ({firebase, path, resolveArg}) {
    return firebase.sendPasswordResetEmail(resolveArg.value(email))
      .then(path.success)
      .catch(path.error)
  }

  return sendPasswordResetEmail
}

export default sendPasswordResetEmailFactory
