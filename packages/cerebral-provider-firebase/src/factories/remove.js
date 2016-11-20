function removeFactory (path) {
  function remove (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path

    return context.firebase.remove(pathTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return remove
}

export default removeFactory
