export class Sequence {
  constructor (...args) {
    if (typeof args[0] === 'string') {
      this.name = args[0]
      this.items = args.slice(1)
    } else {
      this.name = null
      this.items = args
    }
  }
  toJSON () {
    return {
      name: this.name,
      _functionTreePrimitive: true,
      type: 'sequence',
      items: this.items
    }
  }
}

export class Parallel {
  constructor (...args) {
    if (typeof args[0] === 'string') {
      this.name = args[0]
      this.items = args.slice(1)
    } else {
      this.name = null
      this.items = args
    }
  }
  toJSON () {
    return {
      name: this.name,
      _functionTreePrimitive: true,
      type: 'parallel',
      items: this.items
    }
  }
}
