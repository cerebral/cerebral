function httpGetFactory (url) {
  function httpGet ({axios, path}) {
    return axios.get(url)
      .then((response) => path.success({
        status: response.status,
        data: response.data
      }))
      .catch((error) => path.error({
        status: error.response.status,
        data: error.response.data
      }))
  }

  return httpGet
}

export default httpGetFactory
