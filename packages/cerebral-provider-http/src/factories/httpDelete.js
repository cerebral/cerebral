import {convertObjectWithTemplates, processResponse} from '../utils'

function httpDeleteFactory (url, query = {}) {
  function httpDelete ({http, path, resolve}) {
    return processResponse(http.delete(resolve.value(url), convertObjectWithTemplates(query, resolve)), path)
  }

  return httpDelete
}

export default httpDeleteFactory
