function isPrimitive (primitive, type) {
  return primitive._functionTreePrimitive && primitive.type === type
}

/*
  Runs through the tree providing a "next" callback to process next step
  of execution
*/
export default function executeTree (tree, resolveFunctionResult, initialPayload, branchStart, branchEnd, parallelStart, parallelProgress, parallelEnd, end) {
  function runBranch (branch, index, payload, prevPayload, nextBranch) {
    function runNextItem (result) {
      runBranch(branch, index + 1, result, payload, nextBranch)
    }

    function processFunctionOutput (funcDetails, outputResult) {
      return function (result) {
        const newPayload = Object.assign({}, payload, result ? result.payload : {})

        if (result && funcDetails.outputs) {
          const outputs = Object.keys(funcDetails.outputs)

          if (~outputs.indexOf(result.path)) {
            branchStart(funcDetails, result.path, newPayload)
            runBranch(funcDetails.outputs[result.path].items, 0, newPayload, payload, outputResult)
          } else {
            throw new Error(`function-tree - function ${funcDetails.name} must use one of its possible outputs: ${outputs.join(', ')}.`)
          }
        } else {
          outputResult(newPayload)
        }
      }
    }

    const currentItem = branch[index]

    if (!currentItem) {
      if (branch !== tree) {
        branchEnd(payload)
      }
      nextBranch(payload)
    } else if (isPrimitive(currentItem, 'sequence')) {
      runBranch(currentItem.items, 0, payload, prevPayload, runNextItem)
    } else if (isPrimitive(currentItem, 'parallel')) {
      const itemLength = currentItem.items.length
      const payloads = []

      parallelStart(payload, itemLength)
      currentItem.items.forEach((func, index) => {
        if (func.function) {
          resolveFunctionResult(func, payload, prevPayload, processFunctionOutput(func, (payload) => {
            payloads.push(payload)
            if (payloads.length === itemLength) {
              parallelEnd(payload, itemLength)
              runNextItem(Object.assign.apply(Object, [{}].concat(payloads)))
            } else {
              parallelProgress(payload, itemLength - payloads.length)
            }
          }))
        } else {
          runBranch(func.items, 0, payload, prevPayload, function (payload) {
            payloads.push(payload)
            if (payloads.length === itemLength) {
              parallelEnd(payload, itemLength)
              runNextItem(Object.assign.apply(Object, [{}].concat(payloads)))
            } else {
              parallelProgress(payload, itemLength - payloads.length)
            }
          })
        }

        return payloads
      })
    } else {
      resolveFunctionResult(currentItem, payload, prevPayload, processFunctionOutput(currentItem, runNextItem))
    }
  }

  return runBranch([tree], 0, initialPayload, null, end)
}
