import { createReturnPromise } from '../helpers'

function deleteUserFactory(passwordTemplate) {
  function deleteUser({ firebase, resolve, path }) {
    const password = resolve.value(passwordTemplate)

    return createReturnPromise(firebase.deleteUser(password), path)
  }

  return deleteUser
}

export default deleteUserFactory
