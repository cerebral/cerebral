var utils = require('./utils.js');

var traverse = function (item, parentItem, path, actions, isSync) {

  if (Array.isArray(item)) {
    item = item.slice(); // Will do some splicing, so make sure not messing up original array
    isSync = !isSync;
    return item.map(function (subItem, index) {
      path.push(index);
      var result = traverse(subItem, item, path, actions, isSync);
      path.pop();
      return result;
    }).filter(function (action) { // Objects becomes null
      return !!action;
    });
  } else if (typeof item === 'function') {
    var action = {
      name: item.displayName || utils.getFunctionName(item),
      input: {},
      output: null,
      duration: 0,
      mutations: [],
      isAsync: !isSync,
      outputPath: null,
      isExecuting: false,
      hasExecuted: false,
      path: path.slice(),
      outputs: null,
      actionIndex: actions.indexOf(item) === -1 ? actions.push(item) - 1 : actions.indexOf(item)
    };
    var nextItem = parentItem[parentItem.indexOf(item) + 1];
    if (!Array.isArray(nextItem) && typeof nextItem === 'object') {
      parentItem.splice(parentItem.indexOf(nextItem), 1);
      action.outputs = Object.keys(nextItem).reduce(function (paths, key) {
        path = path.concat('outputs', key);
        paths[key] = traverse(nextItem[key], parentItem, path, actions, false);
        path.pop();
        path.pop();
        return paths;
      }, {});
    }
    return action;
  }

};

module.exports = function (signals) {

  var actions = [];
  var branches = traverse(signals, [], [], actions, false);
  return {
    branches: branches,
    actions: actions
  };

};
