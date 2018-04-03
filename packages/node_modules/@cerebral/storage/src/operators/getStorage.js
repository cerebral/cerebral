function getStorageFactory(key) {
  function getStorage({ storage, resolve, path }) {
    const value = storage.get(resolve.value(key))

    if (value instanceof Promise && path) {
      return value
        .then(() => path.success())
        .catch((error) => path.error({ error }))
    } else if (value instanceof Promise) {
      return value.then((value) => ({
        value,
      }))
    }

    return {
      value,
    }
  }

  return getStorage
}

export default getStorageFactory
