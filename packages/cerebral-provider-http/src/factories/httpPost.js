import {convertObjectWithTemplates, processResponse} from '../utils'

function httpPostFactory (url, body = {}) {
  function httpPost ({http, path, resolveArg}) {
    return processResponse(http.post(resolveArg.value(url), convertObjectWithTemplates(body, resolveArg)), path)
  }

  return httpPost
}

export default httpPostFactory
