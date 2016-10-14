export function urlEncode(obj, prefix) {
  var str = [];

  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p];

      str.push(typeof v == 'object' ?
        urlEncode(v, k) :
        encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
}
