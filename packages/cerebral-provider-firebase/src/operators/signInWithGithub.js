import {createReturnPromise, convertObjectWithTemplates} from '../helpers'

function signInWithGithubFactory (options = {}) {
  function signInWithGithub ({firebase, path, resolve}) {
    return createReturnPromise(
      firebase.signInWithGithub(convertObjectWithTemplates(options, resolve)),
      path
    )
  }

  return signInWithGithub
}

export default signInWithGithubFactory
