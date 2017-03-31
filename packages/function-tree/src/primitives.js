export class Primitive {
  constructor (type, ...args) {
    this.type = type

    if (typeof args[0] === 'string') {
      this.name = args[0]
      this.items = args[1]
    } else {
      this.name = null
      this.items = args[0]
    }

    if (!Array.isArray(this.items)) {
      throw new Error(`function-tree: You have not passed an array of functions to ${type}`)
    }
  }
  toJSON () {
    return {
      name: this.name,
      _functionTreePrimitive: true,
      type: this.type,
      items: this.items
    }
  }
}

export class Sequence extends Primitive {
  constructor (...args) {
    super('sequence', ...args)
  }
}

export class Parallel extends Primitive {
  constructor (...args) {
    super('parallel', ...args)
  }
}
