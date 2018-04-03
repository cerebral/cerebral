function setStorageFactory(key, value) {
  function setStorage({ storage, resolve, path }) {
    let maybePromise = storage.set(resolve.value(key), resolve.value(value))

    if (maybePromise instanceof Promise && path) {
      return maybePromise
        .then(() => path.success())
        .catch((error) => path.error({ error }))
    } else if (maybePromise instanceof Promise) {
      return maybePromise
    }
  }

  return setStorage
}

export default setStorageFactory
