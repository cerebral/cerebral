function httpGetFactory(url) {
  function httpGet({axios, result}) {
    return axios.get(url)
      .then((response) => result.success({
        status: response.status,
        data: response.data
      }))
      .catch((error) => result.error({
        status: error.response.status,
        data: error.response.data
      }));
  }

  return httpGet;
}

export default httpGetFactory;
