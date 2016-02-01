import createFeatureDetection from './services/features'
import uaParser from 'user-agent-parser'
import screen from './services/screen'

export default (options = {}) => {
  const {forms} = options

  return (module) => {
    module.alias('cerebral-module-useragent')

    module.state({
      browser: undefined,
      device: undefined,
      features: {},
      os: undefined,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })

    module.services({
      parser: uaParser,
      screen,
      features: createFeatureDetection(options.features)
    })

    return {
      forms
    }
  }
}
