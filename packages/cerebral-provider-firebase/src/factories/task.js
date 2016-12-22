import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from './utils'

function taskFactory (taskName, payload = {}) {
  function task ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const taskNameTemplate = taskName instanceof Tag ? taskName.getValue(tagGetters) : taskName

    return firebase.task(taskNameTemplate, convertObjectWithTemplates(payload, tagGetters))
      .then(path.success)
      .catch(path.error)
  }

  return task
}

export default taskFactory
