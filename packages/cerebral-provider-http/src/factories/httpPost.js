import {convertObjectWithTemplates, processResponse} from '../utils'

function httpPostFactory (url, body = {}) {
  function httpPost ({http, path, resolve}) {
    return processResponse(http.post(resolve.value(url), convertObjectWithTemplates(body, resolve)), path)
  }

  return httpPost
}

export default httpPostFactory
