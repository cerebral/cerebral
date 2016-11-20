import {convertObjectWithTemplates} from './utils'

function updateFactory (updates) {
  function update (context) {
    return context.firebase.update(convertObjectWithTemplates(updates, context))
      .then(context.path.success)
      .catch(context.path.error)
  }

  return update
}

export default updateFactory
