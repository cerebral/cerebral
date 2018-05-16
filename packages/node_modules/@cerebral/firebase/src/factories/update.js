import { createReturnPromise } from '../helpers'

function updateFactory(updates) {
  function update({ firebase, path, resolve }) {
    return createReturnPromise(firebase.update(resolve.value(updates)), path)
  }

  return update
}

export default updateFactory
