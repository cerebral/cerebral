import {convertObjectWithTemplates} from '../utils'

function httpPatchFactory (url, body = {}) {
  function httpPatch (context) {
    const urlTemplate = typeof url === 'function' ? url(context).value : url

    return context.http.patch(urlTemplate, convertObjectWithTemplates(body, context))
      .then(context.path.success)
      .catch((response) => {
        if (response.isAborted) {
          return context.path.abort(response)
        }

        return context.path.error(response)
      })
  }

  return httpPatch
}

export default httpPatchFactory
