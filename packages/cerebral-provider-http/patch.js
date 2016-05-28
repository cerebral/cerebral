var getCompiler = require('cerebral-url-scheme-compiler/get');
var convertToGetters = require('./helpers/convertToGetters');
var createFullUrl = require('./helpers/createFullUrl');

function patch(url, dataPath) {

  var urlGetters = convertToGetters(url);
  var getValue = getCompiler(dataPath);

  function action(args) {
    var services = args.services;
    var httpPath = args['cerebral-module-http'];
    var http = httpPath.reduce(function (services, key) {
      return services[key];
    }, services);
    var output = args.output;

    var fullUrl = createFullUrl(urlGetters, args);

    http.patch(fullUrl, getValue(args))
      .then(output.success)
      .catch(output.error);
  }

  action.async = true;
  action.displayName = 'http.patch (' + ([].slice.call(arguments).join(', ')) + ')';

  return action;

}

module.exports = patch;
