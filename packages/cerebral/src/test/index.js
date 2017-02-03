import Path from 'function-tree/lib/Path'
import {Controller} from '..'

export function runCompute (compute, fixtures = {}) {
  let response
  const controller = Controller({
    state: fixtures.state || {},
    signals: {
      test: [
        ({ resolve }) => {
          response = resolve.compute(compute, fixtures.props)
        }
      ]
    }
  })
  controller.getSignal('test')(fixtures.input)
  return response
}

export function runSignal (signal, fixtures = {}) {
  return new Promise((resolve, reject) => {
    const controller = Controller(Object.assign({}, fixtures, {signals: {signal}}))
    const response = {controller}
    controller.on('functionStart', function (execution, funcDetails, payload) {
      response[funcDetails.name] = {input: payload}
    })
    controller.on('functionEnd', function (execution, funcDetails, payload, result) {
      if (!result || (result instanceof Path && !result.payload)) {
        return
      }
      if (response[funcDetails.name]) {
        response[funcDetails.name].output = result instanceof Path ? result.payload : result
      }
    })
    controller.on('error', reject)
    controller.on('end', () => {
      response.state = controller.getState()
      resolve(response)
    })
    controller.getSignal('signal')(fixtures.input)
  })
}

export function runAction (action, fixtures = {}) {
  return runSignal([action], fixtures)
}
