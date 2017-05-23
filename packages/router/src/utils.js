function compatConfig (config, prev = '') {
  return [].concat(...Object.keys(config).map(key => {
    const conf = config[key]
    if (typeof conf === 'string') {
      return [{path: prev + key, signal: conf}]
    }
    return compatConfig(conf, prev + key)
  }))
}

export function flattenConfig (config, prev = '') {
  if (!Array.isArray(config)) {
    config = compatConfig(config)
  }
  return config.reduce((flattened, {path, signal, map, routes}) => {
    if (routes) {
      Object.assign(flattened, flattenConfig(routes, prev + path))
    }

    const currentPath = prev + path
    const conf = {signal}
    if (map) {
      conf.map = map
      const stateMapping = Object.keys(map).filter((key) => map[key].type === 'state')
      if (stateMapping.length) {
        conf.stateMapping = stateMapping
      }

      const propsMapping = Object.keys(map).filter((key) => map[key].type === 'props')
      if (propsMapping.length) {
        conf.propsMapping = propsMapping
        if (!signal) {
          throw new Error(`Cerebral router - route ${currentPath} has props mappings but no signal was defined.`)
        }
      }
    }

    flattened[currentPath] = conf

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

export function hasChangedPath (changes, path) {
  for (let change in changes) {
    if (changes[change].path.join('.') === path) {
      return true
    }
  }
}
