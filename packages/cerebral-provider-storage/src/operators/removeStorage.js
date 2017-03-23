function removeStorageFactory (key) {
  function removeStorage ({storage, resolve}) {
    return {
      value: storage.remove(resolve.value(key))
    }
  }

  return removeStorage
}

export default removeStorageFactory
