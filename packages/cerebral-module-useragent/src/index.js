import assign from '101/assign'
import feature from './services/feature'
import matchMedia from './services/matchMedia'
import network from './services/network'
import {onOfflineChange} from './services/network'
import uaParser from './services/uaParser'
import window from './services/window'

import moduleRegistered from './signals/moduleRegistered'
import offlineChanged from './signals/offlineChanged'
import windowChanged from './signals/windowChanged'

const defaultOptions = {
  feature: true,
  offline: {
    checkOnLoad: false,
    interceptRequests: true,
    reconnect: {
      initialDelay: 3,
      delay: 1.5
    },
    requests: false
  },
  parse: {
    browser: true,
    device: true,
    os: true
  },
  media: {},
  window: true
}

export default (userOptions = {}) => {
  const options = {}
  assign(options, defaultOptions, userOptions)

  return (module, controller) => {
    module.alias('cerebral-module-useragent')

    module.addState({
      browser: undefined,
      device: undefined,
      feature: {},
      network: {
        offline: false
      },
      os: undefined,
      window: {
        width: undefined,
        height: undefined,
        orientation: undefined
      }
    })

    module.addSignals({
      moduleRegistered,
      offlineChanged,
      windowChanged
    })

    module.addServices({
      feature,
      matchMedia,
      network,
      uaParser,
      window
    })

    controller.once('modulesLoaded', (event) => {
      if (options.offline !== false) {
        onOfflineChange(
          module.getSignals().offlineChanged
        )
        network.offline.options = options.offline
      }

      if (options.window !== false) {
        window.onChange(
          module.getSignals().windowChanged
        )
      }

      module.getSignals().moduleRegistered()
    })

    return {
      options
    }
  }
}
