import {convertObjectWithTemplates} from '../utils'

function httpPutFactory (url, body = {}) {
  function httpPut (context) {
    const urlTemplate = typeof url === 'function' ? url(context).value : url

    return context.http.put(urlTemplate, convertObjectWithTemplates(body, context))
      .then(context.path.success)
      .catch((response) => {
        if (response.isAborted) {
          return context.path.abort(response)
        }

        return context.path.error(response)
      })
  }

  return httpPut
}

export default httpPutFactory
