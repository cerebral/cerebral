import {flattenConfig, getRoutesBySignal, getPath} from './utils'
import {getChangedProps} from 'cerebral/lib/utils'

export default class Router {
  constructor (controller, addressbar, mapper, options) {
    this.controller = controller
    this.addressbar = addressbar
    this.mapper = mapper
    this.options = options
    this.activeRoute = {}
    this.stateGetter = this.controller.getState.bind(this.controller)

    this.provider = {
      router: {
        getUrl: this.getUrl.bind(this),
        setUrl: this.setUrl.bind(this),
        goTo: this.goTo.bind(this),
        redirect: this.redirect.bind(this)
        // getPathUrl(path, partialValues)
        // getSignalUrl(signalName, payload)
      }
    }

    if (!options.baseUrl && options.onlyHash) {
      // autodetect baseUrl
      options.baseUrl = addressbar.pathname
    }
    options.baseUrl = (options.baseUrl || '') + (options.onlyHash ? '#' : '')

    controller.on('initialized', () => {
      this.routesConfig = flattenConfig(options.routes)
      this.routesBySignal = getRoutesBySignal(this.routesConfig, controller)

      addressbar.on('change', this.onUrlChange.bind(this))
      controller.runTree.on('start', this.onSignalStart.bind(this))
      controller.on('flush', this.onFlush.bind(this))

      if (!options.preventAutostart) {
        this.onUrlChange()
      }
    })
  }

  getRoutablePart (url) {
    let path = url.replace(this.addressbar.origin, '')
    if (path[0] !== '/') {
      path = '/' + path
    }
    if (this.options.onlyHash && !~path.indexOf('#')) {
      // treat hash absense as root route
      path = path + '#/'
    }
    return path.indexOf(this.options.baseUrl) === 0
      ? path.replace(this.options.baseUrl, '')
      : null
  }

  onUrlChange (event) {
    const url = this.getRoutablePart(event ? event.target.value : this.addressbar.value)
    if (url === null) return

    const {match, route, values} = this.mapper.map(url, this.routesConfig) || {}

    if (!match) {
      if (this.options.allowEscape) return

      event && event.preventDefault()
      console.warn(`Cerebral router - No route matched ${url}, navigation was prevented. Please verify url or catch unmatched routes with a "/*" route.`) // eslint-disable-line no-console
      return
    }

    event && event.preventDefault()
    const {signal, map, stateMapping, propsMapping} = match
    let payload = values
    const getters = {props: payload, state: this.stateGetter}

    if (stateMapping.length) {
      console.log('set state from url change')
      this.controller.runSignal('router.routed', [
        ({state, resolve}) => {
          stateMapping.forEach((key) => {
            state.set(resolve.path(map[key]), values[key] || null)
          })
        }
      ])
      this.controller.flush()
    }

    if (propsMapping.length) {
      payload = propsMapping.reduce((mappedPayload, key) => {
        mappedPayload[map[key].getPath(getters)] = values[key] || null
        return mappedPayload
      }, {})
    }

    const prevSignal = (this.routesConfig[this.activeRoute.route] || {}).signal
    if (signal && (prevSignal !== signal || getChangedProps(payload || {}, this.activeRoute.payload || {}))) {
      console.log('start signal from url change')
      this.controller.getSignal(signal)(payload)
    }

    this.activeRoute = {route, payload}
  }

  onSignalStart (execution, payload) {
    const route = this.routesBySignal[execution.name]
    if (!route) return

    const {map} = this.routesConfig[route]
    const getters = {props: payload, state: this.stateGetter}

    // resolve mappings on current props and state
    const url = this.mapper.stringify(
      route,
      map
        ? Object.keys(map || {}).reduce((resolved, key) => {
          const value = map[key].getValue(getters)

          if (this.options.filterFalsy && !value) {
            return resolved
          }

          resolved[key] = value
          return resolved
        }, {})
        : payload
    )

    this.setUrl(url)
    console.log('update url on signal start')

    this.activeRoute = {route, payload}
  }

  onFlush (changed) {
    const {route, payload} = this.activeRoute
    const {map, stateMapping} = this.routesConfig[route] || {}
    if (!stateMapping || !stateMapping.length) return

    const getters = {props: payload, state: this.stateGetter}
    let shouldUpdate = false

    const resolvedMap = Object.keys(map || {}).reduce((resolved, key) => {
      const path = map[key].getPath(getters)
      const value = map[key].getValue(getters)

      shouldUpdate = shouldUpdate || (stateMapping.indexOf(key) >= 0 && getPath(changed, path))

      if (!this.options.filterFalsy || value) {
        resolved[key] = value
      }

      return resolved
    }, {})

    if (shouldUpdate) {
      console.log('update url on flush')
      this.setUrl(this.mapper.stringify(route, Object.assign({}, resolvedMap)))
    }
  }

  setUrl (url) {
    this.addressbar.value = (this.options.baseUrl + url) || '/'
  }

  getUrl () {
    return this.addressbar.value.replace(this.addressbar.origin + this.options.baseUrl, '')
  }

  goTo (url) {
    this.addressbar.value = this.options.baseUrl + url
    this.onUrlChange()
  }

  redirect (url) {
    this.addressbar.value = {
      value: this.options.baseUrl + url,
      replace: true
    }

    this.onUrlChange()
  }
}
