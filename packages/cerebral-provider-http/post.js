var getCompiler = require('cerebral-url-scheme-compiler/get');
var convertToGetters = require('./helpers/convertToGetters');
var createFullUrl = require('./helpers/createFullUrl');

function post(url, dataPath) {

  var urlGetters = convertToGetters(url);
  var getValue = getCompiler(dataPath);

  function action(args) {
    var http = args.modules['cerebral-module-http'];
    var output = args.output;

    var fullUrl = createFullUrl(urlGetters, args);

    http.services.post(fullUrl, getValue(args))
      .then(output.success)
      .catch(output.error);
  }

  action.async = true;
  action.displayName = 'http.post (' + ([].slice.call(arguments).join(', ')) + ')';

  return action;

}

module.exports = post;
