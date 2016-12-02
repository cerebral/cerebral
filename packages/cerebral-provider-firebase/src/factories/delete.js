function deleteFactory (pathTemplate, fileTemplate) {
  function deleteOp (context) {
    const path = typeof pathTemplate === 'function' ? pathTemplate(context).value : pathTemplate
    const file = typeof fileTemplate === 'function' ? fileTemplate(context).value : fileTemplate

    return context.firebase.delete(path, file)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return deleteOp
}

export default deleteFactory
