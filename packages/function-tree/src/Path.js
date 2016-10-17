class Path {
  constructor (path, payload) {
    this.path = path
    this.payload = payload
  }
  toJS () {
    return {
      path: this.path,
      payload: this.payload
    }
  }
}

export default Path
