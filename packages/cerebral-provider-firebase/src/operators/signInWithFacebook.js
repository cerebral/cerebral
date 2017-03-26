import {createReturnPromise, convertObjectWithTemplates} from '../helpers'

function signInWithFacebookFactory (options = {}) {
  function signInWithFacebook ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.signInWithFacebook(convertObjectWithTemplates(options, resolve)),
      path
    )
  }

  return signInWithFacebook
}

export default signInWithFacebookFactory
