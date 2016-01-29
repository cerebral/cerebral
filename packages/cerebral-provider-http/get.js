var convertToGetters = require('./helpers/convertToGetters');
var createFullUrl = require('./helpers/createFullUrl');

function get(url) {

  var urlGetters = convertToGetters(url);

  function action(args) {
    var http = args.modules['cerebral-module-http'];
    var output = args.output;

    var fullUrl = createFullUrl(urlGetters, args);

    http.services.get(fullUrl)
      .then(output.success)
      .catch(output.error);
  }

  action.displayName = 'http.get ('  + ([].slice.call(arguments).join(', ')) + ')';

  return action;

}

module.exports = get;
