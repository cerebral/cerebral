import {convertObjectWithTemplates} from './utils'

function signInWithGoogleFactory (options = {}) {
  function signInWithGoogle ({firebase, path, resolveArg}) {
    return firebase.signInWithGoogle(convertObjectWithTemplates(options, resolveArg))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithGoogle
}

export default signInWithGoogleFactory
