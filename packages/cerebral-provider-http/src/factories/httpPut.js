import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from '../utils'

function httpPutFactory (url, body = {}) {
  function httpPut ({http, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const urlTemplate = url instanceof Tag ? url.getValue(tagGetters) : url

    return http.put(urlTemplate, convertObjectWithTemplates(body, tagGetters))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpPut
}

export default httpPutFactory
