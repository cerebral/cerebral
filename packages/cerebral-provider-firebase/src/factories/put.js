import {Tag} from 'cerebral/tags'

function putFactory (pathTemplate, fileTemplate, optionsTemplate = {}) {
  function put ({firebase, state, input, controller, path}) {
    const tagGetters = {state: state.get, input}
    const firebasePath = pathTemplate instanceof Tag ? pathTemplate.getValue(tagGetters) : pathTemplate
    const file = fileTemplate instanceof Tag ? fileTemplate.getValue(tagGetters) : fileTemplate
    const options = Object.keys(optionsTemplate).reduce((opts, key) => {
      const value = optionsTemplate[key]

      if (key === 'progress') {
        if (!(value instanceof Tag)) {
          throw new Error('cerebral-module-firebase: The value for \'progress\' option should be a tag.')
        }

        if (value.type === 'signal') {
          opts[key] = (progress) => {
            // We call progress signal with same 'input' context
            value.getValue({state: state.get, input, signal: controller.getSignal.bind(this)})(Object.assign({}, input, progress))
          }
        } else if (value.type === 'state') {
          opts[key] = (progress) => {
            state.set(value.getPath(tagGetters), progress.progress)
          }
        } else {
          throw new Error('cerebral-module-firebase: The target for \'progress\' option should be either \'state\' or \'signal\' tag.')
        }
      } else {
        opts[key] = value instanceof Tag ? value.getValue(tagGetters) : value
      }
      return opts
    }, {})

    return firebase.put(firebasePath, file, options)
      .then(path.success)
      .catch(path.error)
  }

  return put
}

export default putFactory
