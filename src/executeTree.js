'use strict'

const assign = require('object-assign')

module.exports = function executeTree (tree, resolveFunctionResult, initialPayload, end) {
  function runBranch (branch, index, payload, nextBranch) {
    function runNextItem (result) {
      runBranch(branch, index + 1, result, nextBranch)
    }

    function processFunctionOutput (funcDetails, outputResult) {
      return function (result) {
        let newPayload = assign({}, payload, result ? result.payload : {})

        if (result && funcDetails.outputs) {
          let outputs = Object.keys(funcDetails.outputs)
          if (~outputs.indexOf(result.path)) {
            runBranch(funcDetails.outputs[result.path], 0, newPayload, outputResult)
          } else {
            throw new Error(`function-tree - function ${funcDetails.name} must use one of its possible outputs: ${outputs.join(', ')}.`)
          }
        } else {
          outputResult(newPayload)
        }
      }
    }

    let currentItem = branch[index]
    if (!currentItem) {
      nextBranch ? nextBranch(payload) : end(payload)
    } else if (Array.isArray(currentItem)) {
      const itemLength = currentItem.length
      currentItem.reduce((payloads, action) => {
        resolveFunctionResult(action, payload, processFunctionOutput(action, (payload) => {
          payloads.push(payload)
          if (payloads.length === itemLength) runNextItem(assign.apply(null, [{}].concat(payloads)))
        }))
        return payloads;
      }, [])
    } else {
      resolveFunctionResult(currentItem, payload, processFunctionOutput(currentItem, runNextItem))
    }
  }

  return runBranch(tree, 0, initialPayload, end)
}
