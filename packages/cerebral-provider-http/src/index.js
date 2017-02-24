import request from './request'
import {urlEncode, mergeWith, createResponse} from './utils'
import FileUpload from './fileUpload'
import DEFAULT_OPTIONS from './DEFAULT_OPTIONS'

export { default as FileUpload } from './fileUpload'

import {httpGet as httpGetFactory} from './operators'
import {httpPost as httpPostFactory} from './operators'
import {httpPut as httpPutFactory} from './operators'
import {httpPatch as httpPatchFactory} from './operators'
import {httpDelete as httpGeDeletectory} from './operators'

export httpGet (...args) {
  console.warn('DEPRECATED....')
  return httpGetFactory(...args)
}

export httpPost (...args) {
  console.warn('DEPRECATED....')
  return httpPostFactory(...args)
}

export httpPut (...args) {
  console.warn('DEPRECATED....')
  return httpPutFactory(...args)
}

export httpPatch (...args) {
  console.warn('DEPRECATED....')
  return httpPatchFactory(...args)
}

export httpDelete (...args) {
  console.warn('DEPRECATED....')
  return httpDeleteFactory(...args)
}


export default function HttpProviderFactory (passedOptions) {
  let moduleOptions = mergeWith({}, DEFAULT_OPTIONS)
  if (typeof passedOptions === 'function') {
    moduleOptions = passedOptions(moduleOptions)
  } else if (passedOptions) {
    moduleOptions = mergeWith(passedOptions, DEFAULT_OPTIONS)
  }

  let cachedProvider = null
  function HttpProvider (context) {
    const requests = {}
    function createAbortablePromise (url, cb) {
      return new Promise((resolve, reject) => {
        requests[url] = {
          resolve: resolve,
          reject: reject,
          xhr: cb(function (payload) {
            delete requests[url]
            resolve(payload)
          }, function (error) {
            delete requests[url]
            reject(error)
          })
        }
      })
    }

    function requestService (options) {
      options = mergeWith(options, moduleOptions)

      if (typeof options.onProgress === 'string') {
        options.onProgress = context.controller.getSignal(options.onProgress)
      }

      options.method = options.method.toUpperCase()

      return createAbortablePromise(options.url, (resolve, reject) => {
        return request(options, createResponse(options, resolve, reject))
      })
    }

    if (cachedProvider) {
      context.http = cachedProvider
    } else {
      context.http = cachedProvider = {
        request: requestService,
        get (url, passedQuery, options = {}) {
          const query = passedQuery || options.query

          options.url = query && Object.keys(query).length ? url + '?' + urlEncode(query) : url
          options.method = 'GET'

          return requestService(options)
        },
        post (url, body, options = {}) {
          options.url = options.query && Object.keys(options.query).length ? url + '?' + urlEncode(options.query) : url
          options.method = 'POST'
          options.body = body

          return requestService(options)
        },
        put (url, body, options = {}) {
          options.url = options.query && Object.keys(options.query).length ? url + '?' + urlEncode(options.query) : url
          options.method = 'PUT'
          options.body = body

          return requestService(options)
        },
        patch (url, body, options = {}) {
          options.url = options.query && Object.keys(options.query).length ? url + '?' + urlEncode(options.query) : url
          options.method = 'PATCH'
          options.body = body

          return requestService(options)
        },
        delete (url, query, options = {}) {
          options.url = options.query && Object.keys(options.query).length ? url + '?' + urlEncode(options.query) : url
          options.method = 'DELETE'

          return requestService(options)
        },
        updateOptions (newOptions) {
          moduleOptions = mergeWith(newOptions, moduleOptions)
        },
        abort (regexp) {
          const matchingUrls = Object.keys(requests).filter((url) => {
            return Boolean(url.match(new RegExp(regexp)))
          })
          matchingUrls.forEach((url) => {
            requests[url].xhr.abort()
          })
        },
        fileUpload (options = {}) {
          options.url = moduleOptions.baseUrl + options.url

          return new FileUpload(options)
        }
      }
    }

    if (context.debugger) {
      context.debugger.wrapProvider('http')
    }

    return context
  }
  return HttpProvider
}
