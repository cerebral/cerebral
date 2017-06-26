import { createReturnPromise } from '../helpers'

function signInWithCustomTokenFactory(token) {
  function signInWithCustomToken({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.signInWithCustomToken(resolve.value(token)),
      path
    )
  }

  return signInWithCustomToken
}

export default signInWithCustomTokenFactory
