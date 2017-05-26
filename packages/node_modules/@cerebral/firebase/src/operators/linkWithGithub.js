import { createReturnPromise } from '../helpers'

function linkWithGithubFactory(options) {
  function linkWithGithub({ firebase, path }) {
    return createReturnPromise(firebase.linkWithGithub(options), path)
  }

  return linkWithGithub
}

export default linkWithGithubFactory
