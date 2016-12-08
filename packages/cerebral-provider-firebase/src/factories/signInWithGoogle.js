import {convertObjectWithTemplates} from './utils'

function signInWithGoogleFactory (options = {}) {
  function signInWithGoogle (context) {
    return context.firebase.signInWithGoogle(convertObjectWithTemplates(options, context))
      .then(context.path.success)
      .catch(context.path.error)
  }

  return signInWithGoogle
}

export default signInWithGoogleFactory
