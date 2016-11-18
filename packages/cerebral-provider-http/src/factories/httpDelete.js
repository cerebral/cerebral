import {convertObjectWithTemplates} from '../utils'

function httpDeleteFactory (url, query = {}) {
  function httpDelete (context) {
    const urlTemplate = typeof url === 'function' ? url(context).value : url

    return context.http.delete(urlTemplate, convertObjectWithTemplates(query, context))
      .then(context.path.success)
      .catch((response) => {
        if (response.isAborted) {
          return context.path.abort(response)
        }

        return context.path.error(response)
      })
  }

  return httpDelete
}

export default httpDeleteFactory
