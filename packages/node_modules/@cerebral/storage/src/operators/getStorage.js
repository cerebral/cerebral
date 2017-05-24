function getStorageFactory (key) {
  function getStorage ({storage, resolve}) {
    return {
      value: storage.get(resolve.value(key))
    }
  }

  return getStorage
}

export default getStorageFactory
