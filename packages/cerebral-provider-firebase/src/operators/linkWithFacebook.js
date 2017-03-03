function linkWithFacebookFactory (options) {
  function linkWithFacebook ({firebase, path}) {
    return firebase.linkWithFacebook(options)
      .then(path.success)
      .catch(path.error)
  }

  return linkWithFacebook
}

export default linkWithFacebookFactory
