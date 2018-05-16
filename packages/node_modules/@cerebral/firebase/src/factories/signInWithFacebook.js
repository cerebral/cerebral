import { createReturnPromise } from '../helpers'

function signInWithFacebookFactory(options = {}) {
  function signInWithFacebook({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.signInWithFacebook(resolve.value(options)),
      path
    )
  }

  return signInWithFacebook
}

export default signInWithFacebookFactory
