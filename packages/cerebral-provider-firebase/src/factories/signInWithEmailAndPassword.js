function signInWithEmailAndPasswordFactory (email, password) {
  function signInWithEmailAndPassword (context) {
    const emailTemplate = typeof email === 'function' ? email(context).value : email
    const passwordTemplate = typeof password === 'function' ? password(context).value : password

    return context.firebase.signInWithEmailAndPassword(emailTemplate, passwordTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return signInWithEmailAndPassword
}

export default signInWithEmailAndPasswordFactory
