import {convertObjectWithTemplates} from '../utils'

function httpPostFactory (url, body = {}) {
  function httpPost (context) {
    const urlTemplate = typeof url === 'function' ? url(context).value : url

    return context.http.post(urlTemplate, convertObjectWithTemplates(body, context))
      .then(context.path.success)
      .catch((response) => {
        if (response.isAborted) {
          return context.path.abort(response)
        }

        return context.path.error(response)
      })
  }

  return httpPost
}

export default httpPostFactory
