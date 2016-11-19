function createUserWithEmailAndPasswordFactory (email, password) {
  function createUserWithEmailAndPassword (context) {
    const emailTemplate = typeof email === 'function' ? email(context).value : email
    const passwordTemplate = typeof password === 'function' ? password(context).value : password

    return context.firebase.createUserWithEmailAndPassword(emailTemplate, passwordTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return createUserWithEmailAndPassword
}

export default createUserWithEmailAndPasswordFactory
