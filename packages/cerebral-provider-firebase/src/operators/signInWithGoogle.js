import {createReturnPromise, convertObjectWithTemplates} from '../helpers'

function signInWithGoogleFactory (options = {}) {
  function signInWithGoogle ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.signInWithGoogle(convertObjectWithTemplates(options, resolve)),
      path
    )
  }

  return signInWithGoogle
}

export default signInWithGoogleFactory
