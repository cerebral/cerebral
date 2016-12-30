import {convertObjectWithTemplates} from '../utils'

function httpPostFactory (url, body = {}) {
  function httpPost ({http, path, resolveArg}) {
    return http.post(resolveArg.value(url), convertObjectWithTemplates(body, resolveArg))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpPost
}

export default httpPostFactory
