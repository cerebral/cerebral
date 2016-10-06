var fileUpload = require('./fileUpload')
var request = require('./request')
var utils = require('./utils')
var allowedContentTypes = [
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain'
]
var DEFAULT_OPTIONS = {
  method: 'get',
  baseUrl: '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  },
  onRequest: function(xhr, options) {
    if (options.withCredentials) {
      xhr.withCredentials = true
    }
    if (
      options.cors &&
      options.headers['Content-Type'] &&
      allowedContentTypes.indexOf(options.headers['Content-Type']) === -1
    ) {
      delete options.headers['Content-Type']
    }

    if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      options.body = utils.urlEncode(options.body)
    } else {
      options.body = JSON.stringify(options.body)
    }

    Object.keys(options.headers).forEach(function(key) {
      xhr.setRequestHeader(key, options.headers[key])
    })

    xhr.send(options.body)
  },
  onResponse: function(xhr, resolve, reject) {
    var result = xhr.responseText

    if (xhr.getResponseHeader('content-type').indexOf('application/json') >= 0) {
      result = JSON.parse(xhr.responseText)
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      resolve({
        status: xhr.status,
        result: result
      })
    } else {
      reject({
        status: xhr.status,
        result: result
      })
    }
  }
}

function mergeWith(optionsA, optionsB) {
  return Object.keys(optionsB).reduce(function(newOptions, key) {
    if (!newOptions[key]) {
      newOptions[key] = optionsB[key]
    } else if (key === 'headers') {
      newOptions[key] = mergeWith(newOptions[key], optionsB[key] || {})
    }
    return newOptions
  }, optionsA)
}

export default function HttpProviderFactory(moduleOptions) {
  if (typeof moduleOptions === 'function') {
    var defaultOptions = mergeWith({}, DEFAULT_OPTIONS)
    moduleOptions = moduleOptions(defaultOptions)
  } else {
    moduleOptions = mergeWith(moduleOptions || {}, DEFAULT_OPTIONS)
  }

  let cachedProvider = null
  function HttpProvider(context) {
    var requests = {}
    function createAbortablePromise(url, cb) {
      return new Promise(function(resolve, reject) {
        requests[url] = {
          resolve: resolve,
          reject: reject,
          xhr: cb(function(payload) {
            delete requests[url]
            resolve(payload)
          }, function(error) {
            delete requests[url]
            reject(error)
          })
        }
      })
    }

    function createResponse(options, resolve, reject) {
      return function(event) {
        switch (event.type) {
          case 'load':
            return options.onResponse(event.currentTarget, resolve, reject)
          case 'progress':
            if (options.onProgress && event.lengthComputable) {
              if (typeof options.onProgress === 'string') {
                controller.getSignal(options.onProgress)({
                  progress: +(event.loaded / event.total).toFixed(0)
                })
              } else if (options.onProgress) {
                options.onProgress({
                  progress: +(event.loaded / event.total).toFixed(0)
                })
              }
            }
            break
          case 'error':
            reject({
              status: event.currentTarget.status,
              result: 'Request error'
            })
            break
          case 'abort':
            reject({
              isAborted: true
            })
            break
        }
      }
    }

    function requestService(options) {
      options = mergeWith(options, moduleOptions)

      return createAbortablePromise(options.url, function(resolve, reject) {
        return request(options, createResponse(options, resolve, reject))
      })
    }

    if (cachedProvider) {
      context.http = cachedProvider
    } else {
      context.http = cachedProvider = {
        request: requestService,
        get: function(url, options) {
          options = options || {}
          options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
          options.method = 'GET'
          return requestService(options)
        },
        post: function(url, body, options) {
          options = options || {}
          options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
          options.method = 'POST'
          options.body = body
          return requestService(options)
        },
        put: function(url, body, options) {
          options = options || {}
          options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
          options.method = 'PUT'
          options.body = body
          return requestService(options)
        },
        patch: function(url, body, options) {
          options = options || {}
          options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
          options.method = 'PATCH'
          options.body = body
          return requestService(options)
        },
        delete: function(url, options) {
          options = options || {}
          options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
          options.method = 'DELETE'
          return requestService(options)
        },
        updateOptions: function(newOptions) {
          moduleOptions = mergeWith(newOptions, moduleOptions)
        },
        abort: function(regexp) {
          var matchingUrls = Object.keys(requests).filter(function(url) {
            return Boolean(url.match(new RegExp(regexp)))
          })
          matchingUrls.forEach(function(url) {
            requests[url].xhr.abort()
          })
        },
        fileUpload: function(options) {
          options = options || {}
          options.url = moduleOptions.baseUrl + options.url

          return new fileUpload(options)
        }
      }
    }
  }
  return HttpProvider
}
module.exports.FileUpload = fileUpload
