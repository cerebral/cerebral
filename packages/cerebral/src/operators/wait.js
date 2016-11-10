function waitFactory (ms, continueChain) {
  function wait ({path}) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(path.timeout()), ms)
    })
  }

  return [
    wait, {
      timeout: continueChain
    }
  ]
}

export default waitFactory
