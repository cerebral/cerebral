import {convertObjectWithTemplates} from '../utils'

function httpPutFactory (url, body = {}) {
  function httpPut ({http, path, resolveArg}) {
    return http.put(resolveArg.value(url), convertObjectWithTemplates(body, resolveArg))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpPut
}

export default httpPutFactory
