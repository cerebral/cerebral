function signOutFactory () {
  function signOut (context) {
    return context.firebase.signOut()
      .then(context.path.success)
      .catch(context.path.error)
  }

  return signOut
}

export default signOutFactory
