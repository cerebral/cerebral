function Path(path, payload) {
  this.path = path
  this.payload = payload
}

Path.prototype.toJS = function () {
  return {
    path: this.path,
    payload: this.payload
  }
}

module.exports = Path
