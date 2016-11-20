function valueFactory (path) {
  function value (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path

    return context.firebase.value(pathTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return value
}

export default valueFactory
