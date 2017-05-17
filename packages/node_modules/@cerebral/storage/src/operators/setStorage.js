function setStorageFactory (key, value) {
  function setStorage ({storage, resolve}) {
    storage.set(resolve.value(key), resolve.value(value))
  }

  return setStorage
}

export default setStorageFactory
