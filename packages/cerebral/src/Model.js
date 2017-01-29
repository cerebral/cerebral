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
    Converts an array of paths changed to a change object that
    will be traversed by the dependency store
  */
  flush () {
    const changes = this.changedPaths.reduce((allChanges, path) => {
      path.reduce((currentChanges, key, index) => {
        if (index === path.length - 1) {
          currentChanges[key] = currentChanges[key] === true || !currentChanges[key] ? true : currentChanges[key]
        } else if (!currentChanges[key] || currentChanges[key] === true) {
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
    by multiple mutation methods. Only adds to flush when value
    actually changed. Complex objects always causes a flush due to
    for example array sorting
  */
  updateIn (path, cb) {
    if (this.preventExternalMutations) {
      this.updateInFrozen(path, cb)

      return
    }

    if (!path.length) {
      this.state = cb(this.state)
    }

    path.reduce((currentState, key, index) => {
      if (index === path.length - 1) {
        const newValue = cb(currentState[key])
        if (currentState[key] !== newValue || isComplexObject(currentState[key]) && isComplexObject(newValue)) {
          currentState[key] = newValue
          this.changedPaths.push(path)
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
    this.updateIn(path, () => {
      return value
    })
  }
  push (path, value) {
    this.verifyValue(value, path)
    this.updateIn(path, (array) => {
      return array.concat(value)
    })
  }
  merge (path, ...values) {
    this.verifyValues(values, path)

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
    this.verifyValue(value, path)
    this.updateIn(path, (array) => {
      array.unshift(value)

      return array
    })
  }
  splice (path, ...args) {
    this.verifyValues(args, path)
    this.updateIn(path, (array) => {
      array.splice(...args)

      return array
    })
  }
  unset (path) {
    this.changedPaths.push(path.slice())
    const key = path.pop()

    this.updateIn(path, (obj) => {
      delete obj[key]

      return obj
    })
  }
  concat (path, value) {
    this.verifyValue(value, path)
    this.updateIn(path, (array) => {
      return array.concat(value)
    })
  }
}

export default Model
