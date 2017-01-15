import {convertObjectWithTemplates} from './utils'

function signInWithGoogleFactory (options = {}) {
  function signInWithGoogle ({firebase, path, resolve}) {
    return firebase.signInWithGoogle(convertObjectWithTemplates(options, resolve))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithGoogle
}

export default signInWithGoogleFactory
