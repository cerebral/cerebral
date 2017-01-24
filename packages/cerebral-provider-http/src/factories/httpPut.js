import {convertObjectWithTemplates, processResponse} from '../utils'

function httpPutFactory (url, body = {}) {
  function httpPut ({http, path, resolveArg}) {
    return processResponse(http.put(resolveArg.value(url), convertObjectWithTemplates(body, resolveArg)), path)
  }

  return httpPut
}

export default httpPutFactory
