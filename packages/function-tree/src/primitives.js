export class Sequence {
  constructor (...args) {
    if (typeof args[0] === 'string') {
      this.name = args[0]
      this.items = args[1]
    } else {
      this.name = null
      this.items = args[0]
    }

    if (!Array.isArray(this.items)) {
      throw new Error('function-tree: You have not passed an array of functions to sequence')
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
      this.items = args[1]
    } else {
      this.name = null
      this.items = args[0]
    }

    if (!Array.isArray(this.items)) {
      throw new Error('function-tree: You have not passed an array of functions to parralel')
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
