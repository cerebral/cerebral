var Controller = require('./../src/index.js');
var types = require('./../src/types.js');

var Model = function () {
  return function () {
    return {

    };
  };
};

exports['should be able to register a module'] = function (test) {
  var ctrl = Controller(Model);
  test.done();
};
