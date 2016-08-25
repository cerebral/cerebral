var fileUpload = require('./fileUpload')
var request = require('./request')
var utils = require('./utils')
var allowedContentTypes = [
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain'
]
var modulePath = null
var DEFAULT_OPTIONS = {
  method: 'get',
  baseUrl: '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8'
  },
  onRequest: function (xhr, options) {
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

    Object.keys(options.headers).forEach(function (key) {
      xhr.setRequestHeader(key, options.headers[key])
    })

    xhr.send(options.body)
  },
  onResponse: function (response, resolve, reject) {
    var result = JSON.parse(response.responseText || '""')
    if (response.status >= 200 && response.status < 300) {
      resolve({
        status: response.status,
        result: result
      })
    } else {
      reject({
        status: response.status,
        result: result
      })
    }
  }
}

function mergeWith (optionsA, optionsB) {
  return Object.keys(optionsB).reduce(function (newOptions, key) {
    if (!newOptions[key]) {
      newOptions[key] = optionsB[key]
    } else if (key === 'headers') {
      newOptions[key] = mergeWith(newOptions[key], optionsB[key] || {})
    }
    return newOptions
  }, optionsA)
}

function HttpModule (moduleOptions) {
  if (typeof moduleOptions === 'function') {
    var defaultOptions = mergeWith({}, DEFAULT_OPTIONS)
    moduleOptions = moduleOptions(defaultOptions)
  } else {
    moduleOptions = mergeWith(moduleOptions || {}, DEFAULT_OPTIONS)
  }

  return function (module, controller) {
    var requests = {}
    modulePath = module.path
    function createAbortablePromise (url, cb) {
      return new Promise(function (resolve, reject) {
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

    function createResponse (options, resolve, reject) {
      return function (event) {
        switch (event.type) {
          case 'load':
            return options.onResponse(event.currentTarget, resolve, reject)
          case 'progress':
            if (options.onProgress && event.lengthComputable) {
              if (typeof options.onProgress === 'string') {
                controller.getSignals(options.onProgress)({
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

    function requestService (options) {
      options = mergeWith(options, moduleOptions)

      return createAbortablePromise(options.url, function (resolve, reject) {
        return request(options, createResponse(options, resolve, reject))
      })
    }

    module.addServices({
      request: requestService,
      get: function (url, options) {
        options = options || {}
        options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
        options.method = 'GET'
        return requestService(options)
      },
      post: function (url, body, options) {
        options = options || {}
        options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
        options.method = 'POST'
        options.body = body
        return requestService(options)
      },
      put: function (url, body, options) {
        options = options || {}
        options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
        options.method = 'PUT'
        options.body = body
        return requestService(options)
      },
      patch: function (url, body, options) {
        options = options || {}
        options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
        options.method = 'PATCH'
        options.body = body
        return requestService(options)
      },
      delete: function (url, options) {
        options = options || {}
        options.url = options.query ? url + '?' + utils.urlEncode(options.query) : url
        options.method = 'DELETE'
        return requestService(options)
      },
      updateOptions: function (newOptions) {
        moduleOptions = mergeWith(newOptions, moduleOptions)
      },
      abort: function (regexp) {
        var matchingUrls = Object.keys(requests).filter(function (url) {
          return Boolean(url.match(new RegExp(regexp)))
        })
        matchingUrls.forEach(function (url) {
          requests[url].xhr.abort()
        })
      },
      fileUpload: function (files, options) {
        options = options || {}
        options.url = moduleOptions.baseUrl + options.url

        return new fileUpload(files, options)
      }
    })
  }
}

module.exports = HttpModule

module.exports.httpGet = function httpGet (url) {
  function action (context) {
    var services = context.services
    var service = modulePath.reduce(function (currentService, key) {
      return currentService[key]
    }, services)

    service.get(url)
      .then(context.output.success)
      .catch(context.output.error)
  }
  action.displayName = 'httpGet (' + url + ')'
  action.async = true
  action.outputs = ['success', 'error']

  return action
}

module.exports.FileUpload = fileUpload
