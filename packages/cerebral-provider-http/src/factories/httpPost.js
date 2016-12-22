import {Tag} from 'cerebral/tags'
import {convertObjectWithTemplates} from '../utils'

function httpPostFactory (url, body = {}) {
  function httpPost ({http, state, input, path}) {
    const tagGetters = {state: state.get, input}
    const urlTemplate = url instanceof Tag ? url.getValue(tagGetters) : url

    return http.post(urlTemplate, convertObjectWithTemplates(body, tagGetters))
      .then(path.success)
      .catch((response) => {
        if (response.isAborted) {
          return path.abort(response)
        }

        return path.error(response)
      })
  }

  return httpPost
}

export default httpPostFactory
