class Model {
  constructor(initialState) {
    this.state = initialState || {}
    this.changedPaths = []
  }
  /*
    Converts an array of paths changed to a change object that
    will be traversed by the dependency store
  */
  flush() {
    const changes = this.changedPaths.reduce((allChanges, path) => {
      path.reduce((currentChanges, key, index) => {
        if (index === path.length - 1 && !currentChanges[key]) {
          currentChanges[key] = true
        } else if (currentChanges[key] === true) {
          currentChanges[key] = {}
        } else if (!currentChanges[key]) {
          currentChanges[key] = {}
        }

        return currentChanges[key]
      }, allChanges)

      return allChanges
    }, {})

    this.changedPaths = []

    return changes
  }
  /*
    A generic method for making a change to a path, used
    by multiple mutation methods
  */
  updateIn(path, cb) {
    if (!path.length) {
      this.state = cb(this.state)
    }

    this.changedPaths.push(path)
    path.reduce((currentState, key, index) => {
      if (index === path.length - 1) {
        currentState[key] = cb(currentState[key])
      }

      return currentState[key]
    }, this.state)
  }
  get(path = []) {
    return path.reduce((currentState, key) => {
      return currentState[key]
    }, this.state)
  }
  set(path, value) {
    this.updateIn(path, () => {
      return value
    })
  }
  push(path, value) {
    this.updateIn(path, (array) => {
      return array.concat(value)
    })
  }
  merge(path, value) {
    // We want to show changes to added keys, as this is pretty
    // much like setting multiple keys. More predictable
    Object.keys(value).forEach((key) => {
      this.changedPaths.push(path.concat(key))
    })
    this.updateIn(path, (obj) => {
      return Object.assign(obj, value)
    })
  }
  pop(path) {
    this.updateIn(path, (array) => {
      array.pop()

      return array
    })
  }
  shift(path) {
    this.updateIn(path, (array) => {
      array.shift()

      return array
    })
  }
  unshift(path, value) {
    this.updateIn(path, (array) => {
      array.unshift(value)

      return array
    })
  }
  splice(path, ...args) {
    this.updateIn(path, (array) => {
      array.splice(...args)

      return array
    })
  }
  unset(path) {
    const key = path.pop()

    this.updateIn(path, (obj) => {
      delete obj[key]

      return obj
    })
  }
}

export default Model
