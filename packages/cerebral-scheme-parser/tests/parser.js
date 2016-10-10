const parser = require('../index');

// module.exports['should return null if not string'] = function(test) {
//   const result = parser(123);
//   test.equal(result, null);
//   test.done();
// };

// module.exports['should return null if no scheme match'] = function(test) {
//   const result = parser('123');
//   test.equal(result, null);
//   test.done();
// };

module.exports['should parse target'] = function(test) {
  const result = parser('state:foo');
  test.equal(result.target, 'state');
  test.done();
};

module.exports['should parse value'] = function(test) {
  const result = parser('state:foo');
  test.equal(result.value, 'foo');
  test.done();
};

module.exports['should parse schemes'] = function(test) {
  const result = parser('state:foo.{{input:id}}');
  test.deepEqual(result.schemes, [{target: 'input', value: 'id'}]);
  test.done();
};

module.exports['should parse multiple schemes'] = function(test) {
  const result = parser('state:foo.{{input:id}}.{{state:bar}}');
  test.deepEqual(result.schemes, [{target: 'input', value: 'id'}, {target: 'state', value: 'bar'}]);
  test.done();
};

module.exports['should expose getValue function that replaces inline schemes with returned result'] = function(test) {
  const result = parser('state:foo.{{input:id}}');
  test.equals(result.getValue(function() {
    return 'bar';
  }), 'foo.bar');
  test.done();
};

module.exports['should pass scheme to getValue'] = function(test) {
  const result = parser('state:foo.{{input:id}}');
  test.equals(result.getValue(function(scheme) {
    test.equals(scheme.target, 'input');
    test.equals(scheme.value, 'id');
    return 'bar';
  }), 'foo.bar');
  test.done();
};

module.exports['should expose getValuePromise which resolves value as a promise'] = function(test) {
  test.expect(3);
  const result = parser('state:foo.{{input:id}}');
  result.getValuePromise(function(scheme) {
    test.equals(scheme.target, 'input');
    test.equals(scheme.value, 'id');
    return 'bar';
  })
    .then(function(value) {
      test.equals(value, 'foo.bar');
      test.done();
    });
};

module.exports['should handle multiple schemes with getValuePromise'] = function(test) {
  test.expect(1);
  const result = parser('state:foo.{{input:id}}.{{state:bar}}');
  result.getValuePromise(function(scheme) {
    if (scheme.target === 'input') {
      return 'bar';
    }

    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve('hihi');
      }, 100);
    });
  })
    .then(function(value) {
      test.equals(value, 'foo.bar.hihi');
      test.done();
    });
};
