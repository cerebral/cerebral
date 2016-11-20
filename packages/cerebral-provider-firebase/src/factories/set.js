function setFactory (path, value) {
  function set (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const valueTemplate = typeof value === 'function' ? value(context).value : value

    return context.firebase.set(pathTemplate, valueTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return set
}

export default setFactory
