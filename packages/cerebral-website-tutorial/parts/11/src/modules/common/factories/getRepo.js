function getRepo (repoName) {
  function get ({http, path}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => path.success({data: response.result}))
      .catch(error => path.error({data: error.result}))
  }

  return get
}

export default getRepo
