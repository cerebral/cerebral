import matchMedia from './services/matchMedia'
import parser from './services/parser'
import window from './services/window'

import windowChanged from './signals/windowChanged'
import moduleRegistered from './signals/moduleRegistered'

export default (options = {}) => {
  return (module, controller) => {
    module.alias('cerebral-module-useragent')

    module.addState({
      browser: undefined,
      device: undefined,
      features: {},
      os: undefined,
      window: {
        width: undefined,
        height: undefined,
        orientation: undefined
      }
    })

    module.addSignals({
      moduleRegistered,
      windowChanged
    })

    module.addServices({
      matchMedia,
      parser,
      window
    })

    controller.once('modulesLoaded', event => {
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
