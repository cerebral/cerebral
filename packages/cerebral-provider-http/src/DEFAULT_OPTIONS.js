import {urlEncode, parseHeaders} from './utils'

export default {
  method: 'get',
  baseUrl: '',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json'
  },
  onRequest (xhr, options) {
    if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      options.body = urlEncode(options.body)
    } else if (options.headers['Content-Type'].indexOf('application/json') >= 0) {
      options.body = JSON.stringify(options.body)
    }

    xhr.withCredentials = Boolean(options.withCredentials)

    Object.keys(options.headers).forEach((key) => {
      xhr.setRequestHeader(key, options.headers[key])
    })

    xhr.send(options.body)
  },
  onResponse (xhr, resolve, reject) {
    let result = xhr.responseText

    if (result && xhr.getResponseHeader('Content-Type').indexOf('application/json') >= 0) {
      result = JSON.parse(xhr.responseText)
    }

    const responseHeaders = 'getAllResponseHeaders' in xhr
      ? parseHeaders(xhr.getAllResponseHeaders())
      : null

    if (xhr.status >= 200 && xhr.status < 300) {
      resolve({
        status: xhr.status,
        headers: responseHeaders,
        result: result
      })
    } else {
      reject({
        status: xhr.status,
        headers: responseHeaders,
        result: result
      })
    }
  }
}
