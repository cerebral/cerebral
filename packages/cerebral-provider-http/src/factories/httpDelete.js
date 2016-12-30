import {convertObjectWithTemplates} from '../utils'

function httpDeleteFactory (url, query = {}) {
  function httpDelete ({http, path, resolveArg}) {
    return http.delete(resolveArg.value(url), convertObjectWithTemplates(query, resolveArg))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpDelete
}

export default httpDeleteFactory
