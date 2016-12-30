import {convertObjectWithTemplates} from '../utils'

function httpGetFactory (url, query = {}) {
  function httpGet ({http, path, resolveArg}) {
    return http.get(resolveArg.value(url), convertObjectWithTemplates(query, resolveArg))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpGet
}

export default httpGetFactory
