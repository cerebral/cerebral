function waitFactory(ms) {
  function wait() {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  return wait
}

export default waitFactory
