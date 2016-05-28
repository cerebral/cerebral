var convertToGetters = require('./helpers/convertToGetters');
var createFullUrl = require('./helpers/createFullUrl');

function get(url) {

  var urlGetters = convertToGetters(url);

  function action(args) {
    var services = args.services;
    var httpPath = args['cerebral-module-http'];
    var http = httpPath.reduce(function (services, key) {
      return services[key];
    }, services);
    var output = args.output;

    var fullUrl = createFullUrl(urlGetters, args);

    http.get(fullUrl)
      .then(output.success)
      .catch(output.error);
  }

  action.async = true;
  action.displayName = 'http.get ('  + ([].slice.call(arguments).join(', ')) + ')';

  return action;

}

module.exports = get;
