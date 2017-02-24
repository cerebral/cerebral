class All {
  constructor (items) {
    this.items = items
  }
  toJSON () {
    return {
      _isAll: true,
      items: this.items
    }
  }
}

export default All
