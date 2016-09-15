var utils = require('./utils.js')

var traverse = function (item, parentItem, path, actions, isSync) {
  var nextItem
  var returnAsync = function (item) {
    isSync = !isSync
    return item.map(function (subItem, index) {
      path.push(index)
      var result = traverse(subItem, item, path, actions, isSync)
      path.pop()
      return result
    }).filter(function (action) { // Objects becomes null
      return !!action
    })
  }

  if (typeof item === 'function' && item.async && isSync) {
    nextItem = parentItem[parentItem.indexOf(item) + 1]
    if (!Array.isArray(nextItem) && typeof nextItem === 'object') {
      parentItem.splice(parentItem.indexOf(nextItem), 1)
      return returnAsync([item, nextItem])
    } else {
      return returnAsync([item])
    }
  } else if (Array.isArray(item)) {
    item = item.slice() // Will do some splicing, so make sure not messing up original array
    return returnAsync(item)
  } else if (typeof item === 'function') {
    var action = {
      name: item.displayName || utils.getFunctionName(item),
      options: {
        output: item.output,
        outputs: item.outputs,
        defaultOutput: item.defaultOutput,
        defaultInput: item.defaultInput,
        input: item.input
      },
      duration: 0,
      isAsync: !isSync,
      isExecuting: false,
      hasExecuted: false,
      path: path.slice(),
      outputs: null,
      actionIndex: actions.indexOf(item) === -1 ? actions.push(item) - 1 : actions.indexOf(item)
    }
    if (utils.isDeveloping() && !item.async && !item.outputs && !isSync) {
      console.warn('Cerebral - The action "' + action.name + '" will be run ASYNC even though no outputs are defined. This usually happens when composing chains into chains, which forces actions to run async')
    }
    nextItem = parentItem[parentItem.indexOf(item) + 1]
    if (!Array.isArray(nextItem) && typeof nextItem === 'object') {
      parentItem.splice(parentItem.indexOf(nextItem), 1)
      action.outputs = Object.keys(nextItem).reduce(function (paths, key) {
        if (Array.isArray(item.outputs) && !~item.outputs.indexOf(key)) {
          throw new Error('Cerebral - output path ' + key + ' doesn\'t matches to possible otputs defined for ' + action.name + ' action')
        }
        path = path.concat('outputs', key)
        paths[key] = traverse(nextItem[key], parentItem, path, actions, false)
        path.pop()
        path.pop()
        return paths
      }, {})
    }
    return action
  }
}

module.exports = function (signals) {
  var actions = []
  var branches = traverse(signals, [], [], actions, false)
  return {
    branches: branches,
    actions: actions
  }
}
