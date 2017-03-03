import {isObject, isComplexObject, isSerializable, throwError, forceSerializable} from './utils'

class Model {
  constructor (initialState = {}, devtools = null) {
    this.devtools = devtools
    this.preventExternalMutations = devtools ? devtools.preventExternalMutations : false

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
      // Properties might not be writable, but then there
      // is not reason to freeze its value either
      try {
        object[key] = this.freezeObject(object[key])
      } catch (e) {}
    }

    Object.freeze(object)

    return object
  }
  /*
    Returns array of changes
  */
  flush () {
    const changes = this.changedPaths.slice()

    this.changedPaths = []

    return changes
  }
  /*
    A generic method for making a change to a path, used
    by multiple mutation methods. Only adds to flush when value
    actually changed. Complex objects always causes a flush due to
    for example array sorting
  */
  updateIn (path, cb, forceChildPathUpdates = false) {
    if (this.preventExternalMutations) {
      this.updateInFrozen(path, cb, forceChildPathUpdates)

      return
    }

    if (!path.length) {
      cb(this.state, this, 'state')

      return
    }

    path.reduce((currentState, key, index) => {
      if (index === path.length - 1) {
        const currentValue = currentState[key]

        cb(currentState[key], currentState, key)
        if (currentState[key] !== currentValue || isComplexObject(currentState[key]) && isComplexObject(currentValue)) {
          this.changedPaths.push({
            path,
            forceChildPathUpdates
          })
        }
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
  updateInFrozen (path, cb, forceChildPathUpdates) {
    if (!path.length) {
      cb(this.state, this, 'state')
    }

    this.state = this.unfreezeObject(this.state)
    path.reduce((currentState, key, index) => {
      if (index === path.length - 1) {
        currentState[key] = this.unfreezeObject(currentState[key])

        const currentValue = currentState[key]
        cb(currentState[key], currentState, key)

        if (currentState[key] !== currentValue || isComplexObject(currentState[key]) && isComplexObject(currentValue)) {
          this.changedPaths.push({
            path,
            forceChildPathUpdates
          })
        }
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
  verifyValue (value, path) {
    if (
      this.devtools &&
      !isSerializable(value, this.devtools.allowedTypes)
    ) {
      throwError(`You are passing a non serializable value into the state tree on path ${path.join('.')}`)
    }
    if (this.devtools) {
      forceSerializable(value)
    }
  }
  verifyValues (values, path) {
    if (this.devtools) {
      values.forEach((value) => {
        this.verifyValue(value, path)
      })
    }
  }
  get (path = []) {
    return path.reduce((currentState, key) => {
      return currentState ? currentState[key] : undefined
    }, this.state)
  }
  set (path, value) {
    this.verifyValue(value, path)
    this.updateIn(path, (_, parent, key) => {
      parent[key] = value
    }, true)
  }
  push (path, value) {
    this.verifyValue(value, path)
    this.updateIn(path, (array) => {
      array.push(value)
    })
  }
  merge (path, ...values) {
    const value = Object.assign(...values)

    // If we already have an object we make it behave
    // like multiple sets, indicating a change to very key.
    // If no value it should indicate that we are setting
    // a new object
    if (this.get(path)) {
      for (let prop in value) {
        this.set(path.concat(prop), value[prop])
      }
    } else {
      this.set(path, value)
    }
  }
  pop (path) {
    this.updateIn(path, (array) => {
      array.pop()
    })
  }
  shift (path) {
    this.updateIn(path, (array) => {
      array.shift()
    })
  }
  unshift (path, value) {
    this.verifyValue(value, path)
    this.updateIn(path, (array) => {
      array.unshift(value)
    })
  }
  splice (path, ...args) {
    this.verifyValues(args, path)
    this.updateIn(path, (array) => {
      array.splice(...args)
    })
  }
  unset (path) {
    this.updateIn(path, (_, parent, key) => {
      delete parent[key]
    }, true)
  }
  concat (path, value) {
    this.verifyValue(value, path)
    this.updateIn(path, (array, parent, key) => {
      parent[key] = array.concat(value)
    })
  }
}

export default Model
