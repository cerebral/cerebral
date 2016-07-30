module.exports = function request(options, cb) {
  var xhr = new XMLHttpRequest()
  xhr.addEventListener('progress', cb);
  xhr.addEventListener('load', cb);
  xhr.addEventListener('error', cb);
  xhr.addEventListener('abort', cb);
  xhr.open(options.method, options.baseURL + options.url)
  Object.keys(options.headers).forEach(function (key) {
    xhr.setRequestHeader(key, options.headers[key])
  })
  options.onRequest(xhr, options)
  return xhr
}
