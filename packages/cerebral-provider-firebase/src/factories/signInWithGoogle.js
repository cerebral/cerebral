import {convertObjectWithTemplates} from './utils'

function signInWithGoogleFactory (options = {}) {
  function signInWithGoogle ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}

    return firebase.signInWithGoogle(convertObjectWithTemplates(options, tagGetters))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithGoogle
}

export default signInWithGoogleFactory
