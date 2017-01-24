import {convertObjectWithTemplates, processResponse} from '../utils'

function httpGetFactory (url, query = {}) {
  function httpGet ({http, path, resolveArg}) {
    return processResponse(http.get(resolveArg.value(url), convertObjectWithTemplates(query, resolveArg)), path)
  }

  return httpGet
}

export default httpGetFactory
