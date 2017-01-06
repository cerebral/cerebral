function deleteUserFactory (passwordTemplate) {
  function deleteUser (context) {
    const password = typeof passwordTemplate === 'function' ? passwordTemplate(context).value : passwordTemplate

    return context.firebase.deleteUser(password)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return deleteUser
}

export default deleteUserFactory
