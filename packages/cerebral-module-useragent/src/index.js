import raf from 'raf'
import getFeatures from './getFeatures'
import network from './network'
import parseUserAgent from './parseUserAgent'
import getMedia from './getMedia'
import getWindowSpec from './getWindowSpec'

import createOfflineChanged from './signalFactories/offlineChanged'
import createWindowChanged from './signalFactories/windowChanged'

const defaultOptions = {
  feature: true,
  offline: {
    checkOnLoad: false,
    checks: {xhr: {url: 'https://api.github.com'}},
    interceptRequests: true,
    reconnect: {
      initialDelay: 3,
      delay: 1.5
    },
    requests: false
  },
  parse: {
    browser: true,
    device: true
  },
  media: {},
  window: true
}

export default (userOptions = {}) => {
  const options = Object.assign({}, defaultOptions, userOptions)
  const state = parseUserAgent(options)

  state.media = getMedia(options)
  state.feature = getFeatures(options)
  state.window = getWindowSpec()
  state.network = {offline: network.state === 'down'}

  network.options = options.offline || {}

  return ({controller, path}) => {
    controller.on('initialized', () => {
      const offlineChanged = controller.getSignal(`${path}.offlineChanged`)
      const windowChanged = controller.getSignal(`${path}.windowChanged`)

      if (options.offline !== false) {
        network.on('up', () => { controller.getState(`${path}.network.offline`) && offlineChanged({offline: false}) })
        network.on('down', () => { !controller.getState(`${path}.network.offline`) && offlineChanged({offline: true}) })
        network.check()
      }

      if (options.window !== false) {
        let updatingSpecs = false
        window.addEventListener('resize', (event) => {
          if (updatingSpecs) return
          updatingSpecs = true
          raf(() => {
            windowChanged({
              windowSpec: getWindowSpec(),
              media: getMedia(options)
            })
            updatingSpecs = false
          })
        })
      }
    })

    return {
      state,
      signals: {
        offlineChanged: createOfflineChanged(path),
        windowChanged: createWindowChanged(path)
      }
    }
  }
}
