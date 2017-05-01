import {createReturnPromise} from '../helpers'

function linkWithGoogleFactory (options) {
  function linkWithGoogle ({firebase, path}) {
    return createReturnPromise(
      firebase.linkWithGoogle(options),
      path
    )
  }

  return linkWithGoogle
}

export default linkWithGoogleFactory
