var utils = require('./utils.js');

var asyncSwitch = true;
var traverse = function (item, parentItem, path, actions) {

  if (Array.isArray(item)) {
    item = item.slice(); // Will do some splicing, so make sure not messing up original array
    asyncSwitch = !asyncSwitch;
    return item.map(function (subItem, index) {
      path.push(index);
      var result = traverse(subItem, item, path, actions);
      path.pop();
      return result;
    }).filter(function (action) { // Objects becomes null
      return !!action;
    });
  } else if (typeof item === 'function') {
    var action = {
      name: utils.getFunctionName(item),
      input: {},
      output: null,
      duration: 0,
      mutations: [],
      isAsync: asyncSwitch,
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
        asyncSwitch = true;
        paths[key] = traverse(nextItem[key], parentItem, path, actions);
        path.pop();
        path.pop();
        return paths;
      }, {});
    }
    return action;
  }

};

module.exports = function (signals) {

  asyncSwitch = true;
  var actions = [];
  var branches = traverse(signals, [], [], actions);
  return {
    branches: branches,
    actions: actions
  };

};
