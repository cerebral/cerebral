import { createReturnPromise } from '../helpers'
function taskFactory(taskName, payload = {}) {
  function task({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.task(resolve.value(taskName), resolve.value(payload)),
      path
    )
  }

  return task
}

export default taskFactory
