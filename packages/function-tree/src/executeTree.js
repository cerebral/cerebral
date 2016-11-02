/*
  Runs through the tree providing a "next" callback to process next step
  of execution
*/
export default function executeTree (tree, resolveFunctionResult, initialPayload, branchStart, branchEnd, end) {
  function runBranch (branch, index, payload, nextBranch) {
    function runNextItem (result) {
      runBranch(branch, index + 1, result, nextBranch)
    }

    function processFunctionOutput (funcDetails, outputResult) {
      return function (result) {
        const newPayload = Object.assign({}, payload, result ? result.payload : {})

        if (result && funcDetails.outputs) {
          const outputs = Object.keys(funcDetails.outputs)

          if (~outputs.indexOf(result.path)) {
            branchStart(newPayload)
            runBranch(funcDetails.outputs[result.path], 0, newPayload, outputResult)
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
    } else if (Array.isArray(currentItem)) {
      const itemLength = currentItem.length
      currentItem.reduce((payloads, action) => {
        resolveFunctionResult(action, payload, processFunctionOutput(action, (payload) => {
          payloads.push(payload)
          if (payloads.length === itemLength) runNextItem(Object.assign.apply(Object, [{}].concat(payloads)))
        }))
        return payloads
      }, [])
    } else {
      resolveFunctionResult(currentItem, payload, processFunctionOutput(currentItem, runNextItem))
    }
  }

  return runBranch(tree, 0, initialPayload, end)
}
