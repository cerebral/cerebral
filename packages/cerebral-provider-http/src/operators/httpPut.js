import {convertObjectWithTemplates, processResponse} from '../utils'

function httpPutFactory (url, body = {}) {
  function httpPut ({http, path, resolve}) {
    return processResponse(http.put(resolve.value(url), convertObjectWithTemplates(body, resolve)), path)
  }

  return httpPut
}

export default httpPutFactory
