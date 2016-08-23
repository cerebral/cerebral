function parseResponse (xhr) {
  if (xhr.response) {
    try {
      return JSON.parse(xhr.response)
    } catch (e) {}
  }
  return null
}

var uploadController = function (files, options) {
  if (!options.url) {
    console.warn('upload-controller: options must contain url')
    return
  }

  return new Promise(function (resolve, reject) {
    if (files && files instanceof FileList) {
      var formData = new FormData()
      formData.append('file', files[0])
      if (options.data) {
        Object.keys(options.data).forEach(function (paramKey) {
          formData.append(paramKey, options.data[paramKey])
        })
      }
      var xhr = new XMLHttpRequest()

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
          resolve(parseResponse(xhr))
        } else if (xhr.readyState === 4) {
          reject(parseResponse(xhr))
        }
      }

      xhr.open('POST', options.url, true)

      if (options.headers) {
        Object.keys(options.headers).forEach(function (key) {
          xhr.setRequestHeader(key, options.headers[key])
        })
      }

      xhr.upload.onprogress = function (e) {
        if (options.onProgress) {
          var percentComplete = (e.loaded / e.total) * 100
          options.onProgress({progress: percentComplete.toFixed(0)})
        }
      }

      xhr.send(formData)
    }
  })
}

module.exports = uploadController
