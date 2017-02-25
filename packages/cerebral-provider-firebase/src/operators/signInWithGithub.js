import {convertObjectWithTemplates} from './utils'

function signInWithGithubFactory (options = {}) {
  function signInWithGithub ({firebase, path, resolve}) {
    return firebase.signInWithGithub(convertObjectWithTemplates(options, resolve))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithGithub
}

export default signInWithGithubFactory
