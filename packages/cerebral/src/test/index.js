import Path from 'function-tree/lib/Path'
import {Controller} from '..'
import {ensurePath, cleanPath} from '../utils'

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
    const controller = options.controller || Controller(Object.assign({}, fixtures, Array.isArray(signal) && {signals: {signal}}))
    const response = {controller}

    const actionStart = function (execution, funcDetails, payload) {
      if (options.singleAction) {
        response.props = payload
      } else {
        if (!options.noDuplicateWarnings && response[funcDetails[recordActions]]) {
          console.warn(`Cerebral[runSignal]: signal contains actions with duplicate names ('${funcDetails[recordActions]}')`)
        }
        response[funcDetails[recordActions]] = {props: payload}
      }
    }

    const actionEnd = function (execution, funcDetails, payload, result) {
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
    }

    const error = function (err) {
      off()
      reject(err)
    }

    const signalEnd = () => {
      off()
      response.state = controller.getState()
      resolve(response)
    }

    const off = function () {
      controller.off('functionStart', actionStart)
      controller.off('functionEnd', actionEnd)
      controller.off('error', error)
      controller.off('end', signalEnd)
    }

    controller.on('functionStart', actionStart)
    controller.on('functionEnd', actionEnd)
    controller.on('error', error)
    controller.on('end', signalEnd)
    controller.getSignal(Array.isArray(signal) ? 'signal' : signal)(fixtures.props)
  })
}

export function CerebralTest (fixtures = {}, options = {}) {
  const controller = Controller(Object.assign({}, fixtures))
  const model = controller.getModel()
  return {
    runSignal (signal, props) {
      return runSignal(signal, { props }, Object.assign({}, options, {controller, noDuplicateWarnings: true}))
    },
    setState (path, value) {
      model.set(ensurePath(cleanPath(path)), value)
      model.flush()
    },
    getState (path) {
      return model.get(ensurePath(cleanPath(path)))
    }
  }
}

export function RunSignal (fixtures = {}, options = {}) {
  console.log('RunSignal test helper is deprecated, please use CerebralTest')
  return CerebralTest(fixtures, options).runSignal
}

export function runAction (action, fixtures = {}) {
  return runSignal([action], fixtures, {recordActions: true, singleAction: true})
}
