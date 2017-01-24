import {convertObjectWithTemplates, processResponse} from '../utils'

function httpPatchFactory (url, body = {}) {
  function httpPatch ({http, path, resolveArg}) {
    return processResponse(http.patch(resolveArg.value(url), convertObjectWithTemplates(body, resolveArg)), path)
  }

  return httpPatch
}

export default httpPatchFactory
