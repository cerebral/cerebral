function parseResponse(xhr) {
  try {
    return {
      status: xhr.status,
      result: JSON.parse(xhr.responseText)
    }
  } catch ( e ) {
    return {
      status: xhr.status,
      result: null
    }
  }
}

export default function (options) {
  if (!options.url) {
    console.warn('upload-controller: options must contain url')
    return
  }
  this.isAborted = false
  this.xhr = new XMLHttpRequest()
  this.abort = function() {
    this.isAborted = true;
    this.xhr && this.xhr.abort()
  }

  this.send = function(files) {

    var fileUpload = this;
    var xhr = this.xhr;

    fileUpload.isAborted = false

    return new Promise(function(resolve, reject) {
      if (files && (files instanceof FileList || files.length || files instanceof File)) {
        var formData = new FormData()

        if (files instanceof FileList || files.length) {
          for (var i = 0; i < files.length; i++) {
            formData.append(options.name || 'files', files[i])
          }
        } else {
          formData.append(options.name || 'files', files)
        }

        if (options.data) {
          Object.keys(options.data).forEach(function(paramKey) {
            formData.append(paramKey, options.data[paramKey])
          })
        }

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            resolve(parseResponse(xhr))
          } else if (xhr.readyState === 4) {
            var response = parseResponse(xhr)

            response.isAborted = fileUpload.isAborted
            reject(response)
          }
        }

        xhr.open('POST', options.url, true)

        if (options.headers) {
          Object.keys(options.headers).forEach(function(key) {
            xhr.setRequestHeader(key, options.headers[key])
          })
        }

        xhr.upload.onprogress = function(e) {
          if (options.onProgress) {
            var percentComplete = (e.loaded / e.total) * 100
            options.onProgress({
              progress: +percentComplete.toFixed(0)
            })
          }
        }

        xhr.send(formData)
      } else {
        reject("Not an instance of a File, File[] or FileList");
      }
    })
  }
}


