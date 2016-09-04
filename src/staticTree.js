'use strict'

function getFunctionName (fn) {
  var ret = fn.toString()
  ret = ret.substr('function '.length)
  ret = ret.substr(0, ret.indexOf('('))
  return ret
}

function traverse (functions, item, isChain) {
  if (Array.isArray(item) && typeof isChain === 'boolean') {
    item = item.slice()
    return item.map(function (subItem, index) {
      if (typeof subItem === 'function') {
        let nextSubItem = item[index + 1]
        if (!Array.isArray(nextSubItem) && typeof nextSubItem === 'object') {
          item.splice(index + 1, 1)
          return traverse(functions, subItem, nextSubItem)
        } else {
          return traverse(functions, subItem, null)
        }
      } else if (Array.isArray(item) && isChain) {
        return traverse(functions, subItem, false)
      }
      throw new Error('Signal Tree - Unexpected entry in signal chain')
    }).filter(function (func) {
      return !!func
    })
  } else if (typeof item === 'function') {
    let func = item
    let outputs = isChain
    let funcDetails = {
      name: func.displayName || getFunctionName(func),
      functionIndex: functions.indexOf(func) === -1 ? (functions.push(func) - 1) : functions.indexOf(func),
      function: func
    }
    if (outputs) {
      funcDetails.outputs = {}
      Object.keys(outputs).forEach(function (key) {
        if (func.outputs && !~func.outputs.indexOf(key)) {
          throw new Error(`function-tree - Outputs object doesn\'t match list of possible outputs defined for function.`)
        }
        funcDetails.outputs[key] = traverse(functions, outputs[key], true)
      })
    }

    return funcDetails
  } else {
    throw new Error('function-tree - Unexpected entry in tree')
  }
}

module.exports = function(tree) {
  const functions = []

  return traverse(functions, tree, true)
}
