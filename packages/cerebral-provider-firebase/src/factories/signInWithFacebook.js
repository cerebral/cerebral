import {convertObjectWithTemplates} from './utils'

function signInWithFacebookFactory (options = {}) {
  function signInWithFacebook ({firebase, path, resolveArg}) {
    return firebase.signInWithFacebook(convertObjectWithTemplates(options, resolveArg))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithFacebook
}

export default signInWithFacebookFactory
