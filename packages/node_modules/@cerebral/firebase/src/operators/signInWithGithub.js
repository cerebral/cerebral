import { createReturnPromise } from '../helpers'

function signInWithGithubFactory(options = {}) {
  function signInWithGithub({ firebase, path, resolve }) {
    return createReturnPromise(
      firebase.signInWithGithub(resolve.value(options)),
      path
    )
  }

  return signInWithGithub
}

export default signInWithGithubFactory
