import {convertObjectWithTemplates} from './utils'

function taskFactory (taskName, payload = {}) {
  function task (context) {
    const taskNameTemplate = typeof taskName === 'function' ? taskName(context).value : taskName

    return context.firebase.task(taskNameTemplate, convertObjectWithTemplates(payload, context))
      .then(context.path.success)
      .catch(context.path.error)
  }

  return task
}

export default taskFactory
