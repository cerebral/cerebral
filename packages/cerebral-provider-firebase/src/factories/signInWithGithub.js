import {convertObjectWithTemplates} from './utils'

function signInWithGithubFactory (options = {}) {
  function signInWithGithub ({firebase, path, resolveArg}) {
    return firebase.signInWithGithub(convertObjectWithTemplates(options, resolveArg))
      .then(path.success)
      .catch(path.error)
  }

  return signInWithGithub
}

export default signInWithGithubFactory
