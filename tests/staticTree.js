var staticTree = require('./../src/staticTree.js');

exports['should convert actions to objects'] = function (test) {
  var signal = [
    function sync1 () {

    }
  ];
  var tree = staticTree(signal).branches;
  test.deepEqual(tree, [{
    name: 'sync1',
    input: {},
    output: null,
    duration: 0,
    path: [0],
    mutations: [],
    isExecuting: false,
    hasExecuted: false,
    isAsync: false,
    outputPath: null,
    outputs: null,
    actionIndex: 0
  }]);
  test.done();
};

exports['should use display name of action if available'] = function (test) {
  var action = function () {

  };
  action.displayName = 'foo';
  var signal = [
    action
  ];
  var tree = staticTree(signal).branches;
  test.equal(tree[0].name, 'foo');
  test.done();
};

exports['should bring along arrays and indicate async'] = function (test) {
  var signal = [
    [
      function async1 () {

      }
    ]
  ];
  var tree = staticTree(signal).branches;
  test.equals(tree.length, 1);
  test.ok(Array.isArray(tree[0]));
  test.equals(tree[0][0].name, 'async1');
  test.equals(tree[0][0].isAsync, true);
  test.done();
};

exports['should keep paths'] = function (test) {
  var signal = [
    [
      function async1 () {

      }, {
        success: [
          function sync1 () {

          }
        ]
      }
    ]
  ];
  var tree = staticTree(signal).branches;
  test.equals(tree[0].length, 1);
  test.deepEqual(Object.keys(tree[0][0].outputs), ['success']);
  test.equals(tree[0][0].outputs.success.length, 1);
  test.equals(tree[0][0].outputs.success[0].name, 'sync1');
  test.equals(tree[0][0].outputs.success[0].actionIndex, 1);
  test.done();
};

exports['should handle deeply nested structures'] = function (test) {
  var signal = [
    [
      function async1 () {

      }, {
        success: [
          function sync1 () {

          },
          [
            function async2 () {

            }
          ]
        ]
      }
    ]
  ];
  var tree = staticTree(signal).branches;
  test.equals(tree[0][0].outputs.success[1][0].name, 'async2');
  test.deepEqual(tree[0][0].outputs.success[1][0].path, [0,0,'outputs','success',1,0]);
  test.deepEqual(tree[0][0].outputs.success[1][0].actionIndex, 2);
  test.done();
};

exports['should only keep one reference to an action'] = function (test) {
  var action = function sync1 () {

  }
  var signal = [
    action,
    action
  ];
  var tree = staticTree(signal).branches;
  test.equals(tree[0].actionIndex, 0);
  test.equals(tree[1].actionIndex, 0);
  test.done();
};
