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

export function convertObjectWithTemplates (obj, resolveArg) {
  if (resolveArg.isTag(obj)) {
    return resolveArg.value(obj)
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = resolveArg.value(obj[key])
    return convertedObject
  }, {})
}

export function parseHeaders (rawHeaders) {
  const headerPairs = rawHeaders.replace(/\r?\n$/, '').split(/\r?\n/)

  return headerPairs.reduce((parsedHeaders, headerPair) => {
    const index = headerPair.indexOf(':')
    const key = headerPair.substr(0, index).trim().toLowerCase()
    const value = headerPair.substr(index + 1).trim()
    if (key) {
      parsedHeaders[key] = parsedHeaders[key]
        ? parsedHeaders[key] + ', ' + value
        : value
    }

    return parsedHeaders
  }, {})
}
