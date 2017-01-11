function putFactory (putPath, file, options = {}) {
  function put ({firebase, input, state, path, resolveArg}) {
    const evaluatedOptions = Object.keys(options).reduce((currentEvaluatedOptions, key) => {
      const option = options[key]

      if (key === 'progress') {
        if (!(resolveArg.istag(option, 'state', 'signal'))) {
          throw new Error('cerebral-module-firebase: The value for \'progress\' option should be either \'state\' or \'signal\' tag.')
        }

        if (option.type === 'signal') {
          currentEvaluatedOptions[key] = (progress) => {
            // We call progress signal with same 'input' context
            resolveArg.value(option)(Object.assign({}, input, progress))
          }
        } else {
          currentEvaluatedOptions[key] = (progress) => {
            state.set(resolveArg.path(option), progress.progress)
          }
        }
      } else {
        currentEvaluatedOptions[key] = resolveArg.value(option)
      }

      return currentEvaluatedOptions
    }, {})

    return firebase.put(resolveArg.value(putPath), resolveArg.value(file), evaluatedOptions)
      .then(path.success)
      .catch(path.error)
  }

  return put
}

export default putFactory
