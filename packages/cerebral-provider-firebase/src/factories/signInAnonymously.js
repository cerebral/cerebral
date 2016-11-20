function signInAnonymouslyFactory () {
  function signInAnonymously (context) {
    return context.firebase.signInAnonymously()
      .then(context.path.success)
      .catch(context.path.error)
  }

  return signInAnonymously
}

export default signInAnonymouslyFactory
