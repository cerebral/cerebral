import {convertObjectWithTemplates} from './utils'

function signInWithFacebookFactory (options = {}) {
  function signInWithFacebook ({firebase, state, input, path}) {
    const tagGetters = {state: state.get, input}

    return firebase.signInWithFacebook(convertObjectWithTemplates(options, tagGetters))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithFacebook
}

export default signInWithFacebookFactory
