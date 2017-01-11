import {convertObjectWithTemplates} from './utils'

function taskFactory (taskName, payload = {}) {
  function task ({firebase, path, resolveArg}) {
    return firebase.task(resolveArg.value(taskName), convertObjectWithTemplates(payload, resolveArg))
      .then(path.success)
      .catch(path.error)
  }

  return task
}

export default taskFactory
