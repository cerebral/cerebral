function linkWithGoogleFactory (options) {
  function linkWithGoogle ({firebase, path}) {
    return firebase.linkWithGoogle(options)
      .then(path.success)
      .catch(path.error)
  }

  return linkWithGoogle
}

export default linkWithGoogleFactory
