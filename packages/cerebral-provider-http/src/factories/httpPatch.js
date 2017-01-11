import {convertObjectWithTemplates} from '../utils'

function httpPatchFactory (url, body = {}) {
  function httpPatch ({http, path, resolveArg}) {
    return http.patch(resolveArg.value(url), convertObjectWithTemplates(body, resolveArg))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpPatch
}

export default httpPatchFactory
