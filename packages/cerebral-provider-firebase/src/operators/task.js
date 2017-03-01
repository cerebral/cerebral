import {convertObjectWithTemplates} from './utils'

function taskFactory (taskName, payload = {}) {
  function task ({firebase, path, resolve}) {
    return firebase.task(resolve.value(taskName), convertObjectWithTemplates(payload, resolve))
      .then(path.success)
      .catch(path.error)
  }

  return task
}

export default taskFactory
