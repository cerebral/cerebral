import {isObject, isSerializable, throwError} from './utils'

class Model {
  constructor (initialState = {}, devtools = {}) {
    this.preventExternalMutations = devtools.preventExternalMutations
    this.enforceSerializable = Boolean(devtools.enforceSerializable)
    this.state = (
      this.preventExternalMutations
        ? this.freezeObject(initialState)
        : initialState
    )
    this.changedPaths = []
  }
  /*
    Does an unfreeze and update of value, before freezing again
  */
  unfreezeObject (value) {
    if (Array.isArray(value)) {
      return value.slice()
    } else if (isObject(value)) {
      return Object.assign({}, value)
    }

    return value
  }
  /*
    Freezes objects and arrays recursively to avoid unwanted mutation
  */
  freezeObject (object) {
    if (
      (
        !Array.isArray(object) &&
        !isObject(object)
      ) |
      Object.isFrozen(object)
    ) {
      return object
    }

    for (const key in object) {
      object[key] = this.freezeObject(object[key])
    }

    Object.freeze(object)

    return object
  }
  /*
    Converts an array of paths changed to a change object that
    will be traversed by the dependency store
  */
  flush () {
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
  updateIn (path, cb) {
    if (this.preventExternalMutations) {
      this.updateInFrozen(path, cb)

      return
    }

    if (!path.length) {
      this.state = cb(this.state)
    }

    this.changedPaths.push(path)
    path.reduce((currentState, key, index) => {
      if (index === path.length - 1) {
        currentState[key] = cb(currentState[key])
      } else if (!currentState[key]) {
        throwError(`The path "${path.join('.')}" is invalid, can not update state. Does the path "${path.splice(0, path.length - 1).join('.')}" exist?`)
      }

      return currentState[key]
    }, this.state)
  }
  /*
    Unfreezes on the way down. When done freezes state. It is optimized
    to not go down already frozen paths
  */
  updateInFrozen (path, cb) {
    if (!path.length) {
      this.state = this.freezeObject(cb(this.unfreezeObject(this.state)))
    }

    this.changedPaths.push(path)
    this.state = this.unfreezeObject(this.state)
    path.reduce((currentState, key, index) => {
      if (index === path.length - 1) {
        currentState[key] = cb(this.unfreezeObject(currentState[key]))
      } else if (!currentState[key]) {
        throwError(`The path "${path.join('.')}" is invalid, can not update state. Does the path "${path.splice(0, path.length - 1).join('.')}" exist?`)
      } else {
        currentState[key] = this.unfreezeObject(currentState[key])
      }

      return currentState[key]
    }, this.state)

    this.freezeObject(this.state)
  }
  /*
    Checks if value is serializable, if turned on
  */
  checkValue (value, path) {
    if (this.enforceSerializable && !isSerializable(value)) {
      throwError(`You are passing a non serializable value on ${path.join('.')}`)
    }
  }
  checkValues (values, path) {
    if (this.enforceSerializable) {
      values.forEach((value) => {
        this.checkValue(value, path)
      })
    }
  }
  get (path = []) {
    return path.reduce((currentState, key) => {
      return currentState ? currentState[key] : undefined
    }, this.state)
  }
  set (path, value) {
    this.checkValue(value, path)
    this.updateIn(path, () => {
      return value
    })
  }
  push (path, value) {
    this.checkValue(value, path)
    this.updateIn(path, (array) => {
      return array.concat(value)
    })
  }
  merge (path, value) {
    this.checkValue(value, path)

    // We want to show changes to added keys, as this is pretty
    // much like setting multiple keys. More predictable
    Object.keys(value).forEach((key) => {
      this.changedPaths.push(path.concat(key))
    })
    this.updateIn(path, (obj) => {
      return Object.assign(obj, value)
    })
  }
  pop (path) {
    this.updateIn(path, (array) => {
      array.pop()

      return array
    })
  }
  shift (path) {
    this.updateIn(path, (array) => {
      array.shift()

      return array
    })
  }
  unshift (path, value) {
    this.checkValue(value, path)
    this.updateIn(path, (array) => {
      array.unshift(value)

      return array
    })
  }
  splice (path, ...args) {
    this.checkValues(args, path)
    this.updateIn(path, (array) => {
      array.splice(...args)

      return array
    })
  }
  unset (path) {
    const key = path.pop()

    this.updateIn(path, (obj) => {
      delete obj[key]

      return obj
    })
  }
  concat (path, value) {
    this.checkValue(value, path)
    this.updateIn(path, (array) => {
      return array.concat(value)
    })
  }
}

export default Model
