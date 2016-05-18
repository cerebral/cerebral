var convertToGetters = require('./helpers/convertToGetters');
var createFullUrl = require('./helpers/createFullUrl');

function get(url) {

  var urlGetters = convertToGetters(url);

  function action(args) {
    var http = args.modules['cerebral-module-http'];
    if( ! http) {
      throw "Http action factories require 'cerebral-module-http' module to be added to controller or current module"
    }

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
