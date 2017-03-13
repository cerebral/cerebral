function StorageProvider (options = {}) {
  let cachedProvider = null

  options.json = 'json' in options ? options.json : true
  options.prefix = options.prefix ? options.prefix + '.' : ''

  function createProvider (context) {
    const target = options.target ? window[options.target] : window.localStorage

    if (options.sync) {
      context.controller.on('flush', (changes) => {
        changes.forEach((change) => {
          Object.keys(options.sync).forEach((syncKey) => {
            if (change.path.join('.').indexOf(options.sync[syncKey]) === 0) {
              const value = context.controller.getState(options.sync[syncKey])

              target.setItem(options.prefix + syncKey, options.json ? JSON.stringify(value) : value)
            }
          })
        })
      })
    }

    return {
      get (key) {
        const value = target.getItem(options.prefix + key)

        if (options.json && value) {
          return JSON.parse(value)
        }

        return value
      },
      set (key, value) {
        target.setItem(options.prefix + key, options.json ? JSON.stringify(value) : value)
      }
    }
  }

  return (context) => {
    context.storage = cachedProvider = cachedProvider || createProvider(context)

    if (context.debugger) {
      context.debugger.wrapProvider('storage')
    }

    return context
  }
}

export default StorageProvider
