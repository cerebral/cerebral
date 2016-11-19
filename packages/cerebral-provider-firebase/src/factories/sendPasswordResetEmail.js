function sendPasswordResetEmailFactory (email) {
  function sendPasswordResetEmail (context) {
    const emailTemplate = typeof email === 'function' ? email(context).value : email

    return context.firebase.sendPasswordResetEmail(emailTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return sendPasswordResetEmail
}

export default sendPasswordResetEmailFactory
