import {convertObjectWithTemplates} from './utils'

function signInWithFacebookFactory (options = {}) {
  function signInWithFacebook (context) {
    return context.firebase.signInWithFacebook(convertObjectWithTemplates(options, context))
      .then(context.path.success)
      .catch(context.path.error)
  }

  return signInWithFacebook
}

export default signInWithFacebookFactory
