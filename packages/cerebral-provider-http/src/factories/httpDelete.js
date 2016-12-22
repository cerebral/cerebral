import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from '../utils'

function httpDeleteFactory (url, query = {}) {
  function httpDelete ({http, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const urlTemplate = url instanceof Tag ? url.getValue(tagGetters) : url

    return http.delete(urlTemplate, convertObjectWithTemplates(query, tagGetters))
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
