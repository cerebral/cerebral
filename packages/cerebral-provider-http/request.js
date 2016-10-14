export default function request(options, cb) {
  var xhr = new XMLHttpRequest()
  xhr.addEventListener('progress', cb);
  xhr.addEventListener('load', cb);
  xhr.addEventListener('error', cb);
  xhr.addEventListener('abort', cb);
  xhr.open(options.method, options.baseUrl + options.url)
  options.onRequest(xhr, options)
  return xhr
}
