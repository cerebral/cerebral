var axios = require('axios');

var configIndex = {
  get: 1,
  post: 2,
  delete: 1,
  head: 1,
  put: 2,
  patch: 2
};

var modulePath = null;

function HttpModule (options) {
  options = options || {};
  return function (module, controller) {

    modulePath = module.path

    // Convert response to {result: response.data}
    var convert = function (services, key) {
      services[key] = function () {
        var config = {};
        var passedConfig = arguments[configIndex[key]];

        if (options) {
          config = Object.keys(options).reduce(function (config, key) {
            config[key] = options[key];
            return config;
          }, config);
        }

        if (passedConfig) {
          config = Object.keys(passedConfig).reduce(function (config, key) {
            config[key] = passedConfig[key];
            return config;
          }, config);
        }

        var args = configIndex[key] === 1 ? [arguments[0], config] : [arguments[0], arguments[1], config];

        return axios[key].apply(null, args).then(function (result) {
          return {
            status: result.status,
            result: result.data
          };
        }).catch(function (result) {
          throw {
            result: result
          };
        });
      };
      return services;
    };

    var services = [
      'get',
      'post',
      'delete',
      'head',
      'put',
      'patch'
    ].reduce(convert, {});

    module.addServices(services);

  };
};

module.exports = HttpModule;

module.exports.httpGet = function httpGet(url) {
  function action(context) {
    var services = context.services;
    var service = modulePath.reduce(function (currentService, key) {
      return currentService[key];
    }, services);

    service.get(url)
      .then(context.output.success)
      .catch(context.output.error);
  }
  action.displayName = 'httpGet (' + url + ')';
  action.async = true;
  action.outputs = ['success', 'error'];

  return action;
}
