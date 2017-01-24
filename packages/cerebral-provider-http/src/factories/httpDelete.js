import {convertObjectWithTemplates, processResponse} from '../utils'

function httpDeleteFactory (url, query = {}) {
  function httpDelete ({http, path, resolveArg}) {
    return processResponse(http.delete(resolveArg.value(url), convertObjectWithTemplates(query, resolveArg)), path)
  }

  return httpDelete
}

export default httpDeleteFactory
