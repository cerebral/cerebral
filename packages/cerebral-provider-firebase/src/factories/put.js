function uploadFactory (pathTemplate, fileTemplate, optionsTemplate = {}) {
  function put (context) {
    const path = typeof pathTemplate === 'function' ? pathTemplate(context).value : pathTemplate
    const file = typeof fileTemplate === 'function' ? fileTemplate(context).value : fileTemplate
    const options = Object.keys(optionsTemplate).reduce((opts, key) => {
      const value = optionsTemplate[key]
      if (key === 'progress') {
        if (typeof value !== 'function') {
          throw new Error('cerebral-module-firebase: The value for \'progress\' option should be a tag operator.')
        }
        const progressValue = value(context)
        if (progressValue.target === 'signal') {
          opts[key] = (progress) => {
            // We call progress signal with same 'input' context
            progressValue.value(Object.assign({}, context.input, progress))
          }
        } else if (progressValue.target === 'state') {
          opts[key] = (progress) => {
            context.state.set(progressValue.path, progress.progress)
          }
        } else {
          throw new Error('cerebral-module-firebase: The target for \'progress\' option should be either \'state\' or \'signal\'.')
        }
      } else {
        opts[key] = typeof value === 'function' ? value(context).value : value
      }
      return opts
    }, {})

    return context.firebase.put(path, file, options)
      .then(context.path.success)
      .catch(context.path.error)
  }

  return put
}

export default uploadFactory
