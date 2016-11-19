function getUserFactory () {
  function getUser (context) {
    return context.firebase.getUser()
      .then(context.path.success)
      .catch(context.path.error)
  }

  return getUser
}

export default getUserFactory
