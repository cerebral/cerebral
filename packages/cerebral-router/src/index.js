import {getRoutableSignals, flattenConfig} from './utils'
import urlMapper from 'url-mapper'

let addressbar
try {
  addressbar = require('addressbar')
} catch (e) {
  addressbar = {
    pathname: '/',
    value: '',
    origin: '',
    on () {},
    removeListener () {}
  }
}

export function redirect (url) {
  function redirect ({router}) {
    router.redirect(url)
  }

  return redirect
}

export function goTo (url) {
  function goTo ({router}) {
    router.goTo(url)
  }

  return goTo
}

export default function Router (options = {}) {
  options.mapper = options.mapper || urlMapper({query: options.query})

  return (controller) => {
    if (!options.mapper || typeof options.mapper.map !== 'function') {
      throw new Error('Cerebral router - mapper option must be provided.')
    }

    const routesConfig = flattenConfig(options.routes)

    if (!options.baseUrl && options.onlyHash) {
      // autodetect baseUrl
      options.baseUrl = addressbar.pathname
    }
    if (options.baseUrl && options.onlyHash) {
      options.baseUrl = (options.baseUrl + '/').replace('//', '/')
    }
    options.baseUrl = (options.baseUrl || '') + (options.onlyHash ? '#' : '')

    let signals = {}

    controller.once('initialized', () => {
      signals = getRoutableSignals(routesConfig, controller)
    })

    function onUrlChange (event) {
      let url = event ? event.target.value : addressbar.value
      url = url.replace(addressbar.origin, '')

      if (options.onlyHash && !~url.indexOf('#')) {
        // treat hash absense as root route
        url = url + '#/'
      }

      // check if url should be routed
      if (url.indexOf(options.baseUrl) === 0) {
        const map = options.mapper.map(url.replace(options.baseUrl, ''), routesConfig)

        if (map) {
          event && event.preventDefault()
          addressbar.value = url

          signals[map.match].signal(map.values)
        } else {
          if (options.allowEscape) return

          event && event.preventDefault()
          console.warn(`Cerebral router - No route matched ${url}, navigation was prevented. Please verify url or catch unmatched routes with a "/*" route.`) // eslint-disable-line no-console
        }
      }
    }

    function onSignalStart (execution, payload) {
      const signal = signals[execution.name]
      if (signal) {
        const route = signal.route
        const props = payload

        addressbar.value = options.baseUrl + options.mapper.stringify(route, props)
      }
    }

    function init () {
      addressbar.on('change', onUrlChange)
      controller.runTree.on('start', onSignalStart)
      controller.once('initialized', () => {
        if (!options.preventAutostart) {
          onUrlChange()
        }
      })
    }

    const contextProvider = {
      getUrl () {
        return addressbar.value.replace(addressbar.origin + options.baseUrl, '')
      },
      goTo (url) {
        addressbar.value = options.baseUrl + url
        onUrlChange()
      },
      redirect (url) {
        addressbar.value = {
          value: options.baseUrl + url,
          replace: true
        }

        onUrlChange()
      },
      redirectToSignal (signalName, payload) {
        const signal = signals[signalName]

        if (signal) {
          signal.signal(payload)
        } else {
          console.warn(`Cerebral router - signal ${signalName} is not bound to route. Redirect wouldn't happen.`) // eslint-disable-line no-console
        }
      }
    }

    return {
      init,
      getSignalUrl (signalName, input) {
        if (signals[signalName]) {
          const route = signals[signalName].route
          return options.baseUrl + options.mapper.stringify(route, input || {})
        } else {
          return false
        }
      },
      provider (context) {
        context.router = contextProvider

        return context
      }
    }
  }
}
