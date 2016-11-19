function pushFactory (path, value) {
  function push (context) {
    const pathTemplate = typeof path === 'function' ? path(context).value : path
    const valueTemplate = typeof value === 'function' ? value(context).value : value

    return context.firebase.push(pathTemplate, valueTemplate)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return push
}

export default pushFactory
