module.exports = (api) => {
  api.cache(true)

  return {
    babelrcRoots: ['.', 'packages/*'],
  }
}
