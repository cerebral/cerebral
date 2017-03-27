import {Sequence, Parallel} from './primitives'

function getFunctionName (fn) {
  let ret = fn.toString()
  ret = ret.substr('function '.length)
  ret = ret.substr(0, ret.indexOf('('))

  return ret
}

function isPaths (item) {
  return (
    item &&
    !Array.isArray(item) &&
    typeof item === 'object' &&
    !(item instanceof Sequence) &&
    !(item instanceof Parallel)
  )
}

function analyze (functions, item, isParallel, abortChain) {
  if (item instanceof Parallel || item instanceof Sequence) {
    const instance = item.toJSON()

    return Object.assign(instance, {
      items: analyze(functions, instance.items, item instanceof Parallel, item.abortChain).items
    })
  } else if (Array.isArray(item)) {
    return new Sequence(item.reduce((allItems, subItem, index) => {
      if (subItem instanceof Parallel || subItem instanceof Sequence) {
        const instance = subItem.toJSON()

        return allItems.concat(Object.assign(instance, {
          items: analyze(functions, instance.items, subItem instanceof Parallel).items
        }))
      } else if (typeof subItem === 'function') {
        const funcDetails = {
          name: subItem.displayName || getFunctionName(subItem),
          functionIndex: functions.push(subItem) - 1,
          function: subItem
        }

        if (abortChain) {
          funcDetails.getAbortChain = () => abortChain
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
        const items = analyze(functions, subItem)

        return allItems.concat(items)
      } else {
        throw new Error('function-tree - Unexpected entry in tree')
      }
    }, [])).toJSON()
  } else {
    throw new Error('function-tree - Unexpected entry in tree')
  }
}

export default (tree) => {
  const functions = []

  return analyze(functions, typeof tree === 'function' ? [tree] : tree)
}
