var utils = require('./utils.js');
var types = require('./types.js');

var validateOutput = function (action, path, arg, signalName) {
  if ((!action.output && !action.outputs) || Array.isArray(action.outputs)) {
    return;
  }

  var checkers = action.output || action.outputs[path || action.defaultOutput];

  if (checkers === undefined && arg === undefined) {
    return;
  }

  Object.keys(checkers).forEach(function (key) {
    if (!types(checkers[key], arg[key])) {
      throw new Error([
        'Cerebral: There is a wrong output of action "' +
        utils.getFunctionName(action) + '" ' +
        'in signal "' + signalName + '". Check the following prop: "' + key + '"'
      ].join(''));
    }
  });

};

var createNextFunction = function (action, signalName, resolver) {
    var next = function () {

      if (next.hasRun) {
        throw new Error('Cerebral - You are running an async output on a synchronous action in ' + signalName + '. The action is ' + action.name +  '. Either put it in an array or make sure the output is synchronous');
      }

      var path = typeof arguments[0] === 'string' ? arguments[0] : null;
      var arg = path ? arguments[1] : arguments[0];

      // Test payload
      if (utils.isDeveloping()) {
        try {
          JSON.stringify(arg);
        } catch (e) {
          console.log('Not serializable', arg);
          throw new Error('Cerebral - Could not serialize output. Please check signal ' + signalName + ' and action ' + action.name);
        }
      }

      if (!path && !action.defaultOutput && action.outputs) {
        throw new Error([
          'Cerebral: There is a wrong output of action "' +
          utils.getFunctionName(action) + '" ' +
          'in signal "' + signalName + '". Set defaultOutput or use one of outputs ' +
          JSON.stringify(Object.keys(action.output || action.outputs))
        ].join(''));
      }

      if (utils.isDeveloping()) {
        validateOutput(action, path, arg, signalName);
      }

      // This is where I verify path and types
      var result = {
        path: path ? path : action.defaultOutput,
        arg: arg
      };

      if (resolver) {
        resolver(result);
      } else {
        next._result = result;
      }
    };
    return next;
};

var addOutputs = function (action, next) {
  if (!action.outputs) {
    next.success = next.bind(null, 'success');
    next.error = next.bind(null, 'error');
  } else if (Array.isArray(action.outputs)) {
    action.outputs.forEach(function (key) {
      next[key] = next.bind(null, key);
    });
  } else {
    Object.keys(action.outputs).forEach(function (key) {
      next[key] = next.bind(null, key);
    });
  }
};

module.exports = {
  sync: function (action, signalName) {
    var next = createNextFunction(action, signalName);
    addOutputs(action, next);

    if (utils.isDeveloping()) {
      setTimeout(function () {
        next.hasRun = true;
      }, 0);
    }

    return next;
  },
  async: function (action, signalName) {
    var resolver = null;
    var promise = new Promise(function (resolve) {
      resolver = resolve;
    });
    var next = createNextFunction(action, signalName, resolver);
    addOutputs(action, next);
    return {
      fn: next,
      promise: promise
    };

  }
};
