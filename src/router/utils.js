import {isObject} from '../utils'

export function flattenConfig (config, prev = '') {
  return Object.keys(config).reduce((flattened, key) => {
    if (isObject(config[key])) {
      return Object.assign(flattened, flattenConfig(config[key], prev + key))
    }

    flattened[prev + key] = config[key]

    return flattened
  }, {})
}

export function getRoutableSignals (config, controller) {
  return Object.keys(config).reduce((routableSignals, route) => {
    const signal = controller.getSignal(config[route])

    if (!signal) {
      throw new Error(`Cerebral router - The signal ${config[route]} for the route ${route} does not exist.`)
    }

    if (routableSignals[config[route]]) {
      throw new Error(`Cerebral router - The signal ${config[route]} has already been bound to route ${route}. Create a new signal and reuse actions instead if needed.`)
    }

    routableSignals[config[route]] = {
      route: route,
      signal: signal
    }

    return routableSignals
  }, {})
}
