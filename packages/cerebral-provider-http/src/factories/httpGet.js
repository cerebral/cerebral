import {convertObjectWithTemplates} from '../utils'

function httpGetFactory (url, query = {}) {
  function httpGet (context) {
    const urlTemplate = typeof url === 'function' ? url(context).value : url

    return context.http.get(urlTemplate, convertObjectWithTemplates(query, context))
      .then(context.path.success)
      .catch((response) => {
        if (response.isAborted) {
          return context.path.abort(response)
        }

        return context.path.error(response)
      })
  }

  return httpGet
}

export default httpGetFactory
