var utils = require('./utils.js');

module.exports = function (model) {

  var computationPaths = null;

  var createMapper = function(stringPath, cb) {

    var path = stringPath.split('.');
    var currentState = {};
    var currentValue = null;
    var currentPassedValue = null;

    var get = function(path) {
      path = typeof path === 'string' ? [].slice.call(arguments) : path;
      return currentState[path.join('.')] = model.accessors.get(path);
    };

    return function() {

        var freshValue = model.accessors.get(path);
        var isSame = Object.keys(currentState).reduce(function (hasChanged, key) {
          if (hasChanged) {
            return true;
          }
          return model.accessors.get(key.split('.')) === currentState[key];
        }, false) && freshValue=== currentPassedValue;

        if (isSame) {
          return currentValue;
        } else {
          currentPassedValue = freshValue;
          currentState = {};
          return currentValue = cb(get, currentPassedValue);
        }
    };
  };

  return {
    register: function (computeTree) {
        var match = utils.extractMatchingPathFunctions(computeTree, model.accessors.get());
        if (Array.isArray(match)) {
          throw new Error('Cerebral - Computation tree does not match state store tree. Failed node: ' + match.join('.'));
        }
        computationPaths = Object.keys(match).reduce(function (computations, key) {
          computations[key] = createMapper(key, match[key]);
          return computations;
        }, {});
    },
    getComputedValue: function (path) {
      if (!computationPaths) {
        return;
      }
      var compute = computationPaths[path.join('.')];
      return compute ? compute(model.accessors.get(path)) : undefined;
    },
    getComputedPaths: function () {
      return Object.keys(computationPaths || {}).map(function (path) {
        return path.split('.');
      });
    }
  };

};
