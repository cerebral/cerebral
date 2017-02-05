import Path from 'function-tree/lib/Path'
import {Controller} from '..'

export function runCompute (compute, fixtures = {}) {
  let response
  const controller = Controller({
    state: fixtures.state || {},
    signals: {
      test: [
        ({ resolve }) => {
          response = resolve.value(compute, fixtures.props)
        }
      ]
    }
  })
  controller.getSignal('test')(fixtures.props)
  return response
}

export function runSignal (signal, fixtures = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const recordActions = options.recordActions && options.recordActions === 'byName' ? 'name' : 'functionIndex'
    const controller = Controller(Object.assign({}, fixtures, {signals: {signal}}))
    const response = {controller}
    if (recordActions) {
      controller.on('functionStart', function (execution, funcDetails, payload) {
        if (options.singleAction) {
          response.props = payload
        } else {
          if (response[funcDetails[recordActions]]) {
            console.warn(`Cerebral[runSignal]: signal contains actions with duplicate names ('${funcDetails[recordActions]}')`)
          }
          response[funcDetails[recordActions]] = {props: payload}
        }
      })
      controller.on('functionEnd', function (execution, funcDetails, payload, result) {
        if (!result || (result instanceof Path && !result.payload)) {
          return
        }
        if (options.singleAction || response[funcDetails[recordActions]]) {
          const output = result instanceof Path ? result.payload : result
          if (options.singleAction) {
            response.output = output
          } else {
            response[funcDetails[recordActions]].output = output
          }
        }
      })
    }
    controller.on('error', reject)
    controller.on('end', () => {
      response.state = controller.getState()
      resolve(response)
    })
    controller.getSignal('signal')(fixtures.props)
  })
}

export function runAction (action, fixtures = {}) {
  return runSignal([action], fixtures, {recordActions: true, singleAction: true})
}
