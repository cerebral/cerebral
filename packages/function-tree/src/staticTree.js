import All from './All'

function getFunctionName (fn) {
  let ret = fn.toString()
  ret = ret.substr('function '.length)
  ret = ret.substr(0, ret.indexOf('('))

  return ret
}

function isPaths (item) {
  return item && !Array.isArray(item) && typeof item === 'object'
}

function analyze (functions, item, isParallel) {
  if (item instanceof All) {
    const allInstance = item.toJSON()

    return Object.assign(allInstance, {
      items: analyze(functions, allInstance.items, true)
    })
  } else if (Array.isArray(item)) {
    return item.reduce((allItems, subItem, index) => {
      if (subItem instanceof All) {
        const allInstance = subItem.toJSON()

        return allItems.concat(Object.assign(allInstance, {
          items: analyze(functions, allInstance.items, true)
        }))
      } else if (typeof subItem === 'function') {
        const funcDetails = {
          name: subItem.displayName || getFunctionName(subItem),
          functionIndex: functions.push(subItem) - 1,
          function: subItem,
          isParallel: Boolean(isParallel)
        }
        const nextItem = item[index + 1]

        if (isPaths(nextItem)) {
          funcDetails.outputs = {}
          Object.keys(nextItem).forEach((key) => {
            if (subItem.outputs && !~subItem.outputs.indexOf(key)) {
              throw new Error(`function-tree - Outputs object doesn't match list of possible outputs defined for function.`)
            }
            funcDetails.outputs[key] = analyze(functions, typeof nextItem[key] === 'function' ? [nextItem[key]] : nextItem[key])
          })
        }

        return allItems.concat(funcDetails)
      } else if (isPaths(subItem)) {
        return allItems
      } else if (Array.isArray(subItem)) {
        return allItems.concat(analyze(functions, subItem))
      } else {
        throw new Error('function-tree - Unexpected entry in tree')
      }
    }, [])
  } else {
    throw new Error('function-tree - Unexpected entry in tree')
  }
}

export default (tree) => {
  const functions = []
  const analyzedTree = analyze(functions, typeof tree === 'function' ? [tree] : tree)

  return Array.isArray(analyzedTree) ? analyzedTree : [analyzedTree]
}
