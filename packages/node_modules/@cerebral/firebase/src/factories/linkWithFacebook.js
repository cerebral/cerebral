import { createReturnPromise } from '../helpers'

function linkWithFacebookFactory(options) {
  function linkWithFacebook({ firebase, path }) {
    return createReturnPromise(firebase.linkWithFacebook(options), path)
  }

  return linkWithFacebook
}

export default linkWithFacebookFactory
