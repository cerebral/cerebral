var getCompiler = require('cerebral-url-scheme-compiler/get');

module.exports = function (url) {
  var urlGetters;
  if (Array.isArray(url)) {
    urlGetters = url.map(function (urlPart) {
      return {
        fn: getCompiler(urlPart),
        urlPart: urlPart
      };
    });
  } else {
    urlGetters = [{
      fn: function () {},
      urlPart: url
    }];
  }
  return urlGetters;
}
