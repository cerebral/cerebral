import { createReturnPromise } from '../helpers'

function signInWithGoogleFactory(options = {}) {
  function signInWithGoogle({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.signInWithGoogle(resolve.value(options)),
      path
    )
  }

  return signInWithGoogle
}

export default signInWithGoogleFactory
