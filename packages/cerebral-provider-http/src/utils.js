export function createResponse (options, resolve, reject) {
  return (event) => {
    switch (event.type) {
      case 'load':
        return options.onResponse(event.currentTarget, resolve, reject)
      case 'progress':
        if (options.onProgress && event.lengthComputable) {
          options.onProgress({
            progress: Number(event.loaded / event.total).toFixed(0)
          })
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

export function mergeWith (optionsA, optionsB) {
  return Object.keys(optionsB).reduce((newOptions, key) => {
    if (!newOptions[key]) {
      newOptions[key] = optionsB[key]
    } else if (key === 'headers') {
      newOptions[key] = mergeWith(newOptions[key], optionsB[key] || {})
    }

    return newOptions
  }, optionsA)
}

export function urlEncode (obj, prefix) {
  var str = []

  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p
      var v = obj[p]

      str.push(typeof v === 'object'
        ? urlEncode(v, k)
        : encodeURIComponent(k) + '=' + encodeURIComponent(v))
    }
  }
  return str.join('&')
}

export function convertObjectWithTemplates (obj, context) {
  if (typeof obj === 'function') {
    return obj(context).value
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = typeof obj[key] === 'function' ? obj[key](context).value : obj[key]

    return convertedObject
  }, {})
}
