import {convertObjectWithTemplates} from './utils'

function signInWithFacebookFactory (options = {}) {
  function signInWithFacebook ({firebase, path, resolve}) {
    return firebase.signInWithFacebook(convertObjectWithTemplates(options, resolve))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithFacebook
}

export default signInWithFacebookFactory
