function putFactory (putPath, file, options = {}) {
  function put ({firebase, input, state, path, resolve}) {
    const evaluatedOptions = Object.keys(options).reduce((currentEvaluatedOptions, key) => {
      const option = options[key]

      if (key === 'progress') {
        if (!(resolve.istag(option, 'state', 'signal'))) {
          throw new Error('cerebral-module-firebase: The value for \'progress\' option should be either \'state\' or \'signal\' tag.')
        }

        if (option.type === 'signal') {
          currentEvaluatedOptions[key] = (progress) => {
            // We call progress signal with same 'input' context
            resolve.value(option)(Object.assign({}, input, progress))
          }
        } else {
          currentEvaluatedOptions[key] = (progress) => {
            state.set(resolve.path(option), progress.progress)
          }
        }
      } else {
        currentEvaluatedOptions[key] = resolve.value(option)
      }

      return currentEvaluatedOptions
    }, {})

    return firebase.put(resolve.value(putPath), resolve.value(file), evaluatedOptions)
      .then(path.success)
      .catch(path.error)
  }

  return put
}

export default putFactory
