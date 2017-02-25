function linkWithGithubFactory (options) {
  function linkWithGithub ({firebase, path}) {
    return firebase.linkWithGithub(options)
      .then(path.success)
      .catch(path.error)
  }

  return linkWithGithub
}

export default linkWithGithubFactory
