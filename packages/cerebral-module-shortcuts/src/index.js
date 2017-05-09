import shortway from 'shortway'

export default function (shortcuts) {
  return module => {
    module.controller.on('initialized', () => {
      Object.keys(shortcuts).forEach(shortcut => {
        const registeredShortcut = shortway(shortcut, () => {
          module.controller.getSignal(shortcuts[shortcut])({})
        })
        document.addEventListener('keyup', registeredShortcut)
      })
    })

    return {}
  }
}
