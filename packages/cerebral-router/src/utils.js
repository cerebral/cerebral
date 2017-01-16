export function flattenConfig (config, prev = '') {
  return config.reduce((flattened, {path, signal, map, routes}) => {
    if (Array.isArray(routes)) {
      return Object.assign(flattened, flattenConfig(routes, prev + path))
    }

    const currentPath = prev + path
    const stateMapping = Object.keys(map || {}).filter((key) => map[key].type === 'state')
    const inputMapping = Object.keys(map || {}).filter((key) => map[key].type === 'input')

    if (inputMapping.length && !signal) {
      throw new Error(`Cerebral router - route ${currentPath} has input mappings but no signal was defined.`)
    }

    flattened[currentPath] = {signal, map, stateMapping, inputMapping}

    return flattened
  }, {})
}

export function getRoutesBySignal (config) {
  return Object.keys(config).reduce((routableSignals, route) => {
    const {signal: signalName} = config[route]

    if (!signalName) {
      return routableSignals
    }

    if (routableSignals[signalName]) {
      throw new Error(`Cerebral router - The signal ${signalName} has already been bound to route ${route}. Create a new signal and reuse actions instead if needed.`)
    }

    routableSignals[signalName] = route

    return routableSignals
  }, {})
}

export function getPath (object, path) {
  return path.split('.').reduce((currentPath, key) => {
    return currentPath ? currentPath[key] : undefined
  }, object)
}
