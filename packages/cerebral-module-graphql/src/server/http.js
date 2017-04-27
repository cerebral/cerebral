import {introspectionQuery, buildClientSchema} from 'graphql'
import {GraphQlModuleError} from '../errors'

function createRequest (options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('load', () => {
      if (
        xhr.responseText &&
        xhr.getResponseHeader('Content-Type').indexOf('application/json') >= 0 &&
        xhr.status >= 200 && xhr.status < 300
      ) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(xhr.responseText)
      }
    })
    xhr.addEventListener('error', reject)
    xhr.open(options.method, options.url)
    xhr.withCredentials = Boolean(options.withCredentials)

    Object.keys(options.headers || {}).forEach((key) => {
      xhr.setRequestHeader(key, options.headers[key])
    })

    options.body ? xhr.send(JSON.stringify(options.body)) : xhr.send()

    return xhr
  })
}

export default {
  getSchema (options) {
    return createRequest({
      url: `${options.endpoint}`,
      body: {
        query: introspectionQuery
      },
      method: 'POST',
      headers: options.headers || {}
    })
      .then((result) => {
        return buildClientSchema(result.data)
      })
      .catch((response) => {
        console.log(response);
        throw new GraphQlModuleError(`The request for graphQl schema, using introspectionQuery, failed. The request returned: ${response}`)
      })
  },
  query (query, options) {
    return createRequest({
      url: `${options.endpoint}`,
      body: {
        query
      },
      method: 'POST',
      headers: options.headers || {}
    })
  }
}
