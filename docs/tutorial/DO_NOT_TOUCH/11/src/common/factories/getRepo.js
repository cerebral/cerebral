function getRepoFactory (repoName) {
  function getRepo ({http}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then((response) => {
        return {[repoName]: response.result}
      })
      .catch((error) => {
        return {error: error.result}
      })
  }

  return getRepo
}

export default getRepoFactory
