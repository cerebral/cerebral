import assign from '101/assign'
import feature from './services/feature'
import network from './services/network'
import {onOfflineChange} from './services/network'
import uaParser from './services/uaParser'
import window from './services/window'
import {getFeatures} from './services/feature'
import {matchMedia, getMedia} from './services/media'

import offlineChanged from './signals/offlineChanged'
import windowChanged from './signals/windowChanged'

import {MODULE, addContext} from './helper/module'

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

const services = {
  feature,
  getFeatures,
  matchMedia,
  getMedia,
  network,
  uaParser,
  window
}

export default (userOptions = {}) => {
  const options = {}
  assign(options, defaultOptions, userOptions)

  return (module, controller) => {
    module.alias(MODULE)

    const state = services.uaParser.parseUserAgent(options)
    state.media = services.getMedia(options)
    state.feature = services.getFeatures(options)
    state.window = window.getSpecs()
    state.network = {offline: false}
    module.addState(state)

    module.addSignals({
      offlineChanged,
      windowChanged
    })

    module.addServices(services)

    addContext(module, {
      options,
      path: module.path
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
    })

    return {
      options
    }
  }
}
