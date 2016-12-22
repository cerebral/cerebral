import DependencyStore from './DependencyStore'
import {cleanPath, ensurePath, isObject, throwError, propsDiffer} from './utils'

/*
  The dependency store used to store and extract what computeds
  to flag as dirty when there are state uptates
*/
export const dependencyStore = new DependencyStore()

/*
  The computed instance controls the value production. It
  registers itself to the dependency store so when the
  controller flushes it will extract affected computeds and
  flag them as dirty. These are created when you call a computed
  inside components.
*/
export class Computed {
  constructor (props, factory) {
    this.passedProps = props
    this.func = factory.func
    this.value = null
    this.paths = factory.paths
    this.depsMap = null
    this.factory = factory

    this.isDirty = true
    this.isRegistered = false
  }
  /*

  */
  /*
    Uses the factory to return a computed for the given props. This returns
    the same computed given the same props (cache in factory).
  */
  props (...args) {
    return this.factory.create(...args)
  }
  /*
    This method is called by the controller when a flush happens and
    the dependency store returns affected computeds
  */
  flag () {
    this.isDirty = true
  }
  /*
    This method is called by manually busting cache of computeds, also busting
    nested computeds
  */
  flagAll () {
    this.flag()
    Object.keys(this.paths).forEach((pathKey) => {
      if (this.paths[pathKey] instanceof Computed) {
        this.paths[pathKey].flag()
      }
    })
  }
  /*
    Creates the getters for evaluating tags
  */
  createTagGetters (model) {
    return {
      state (path) { return model.get(ensurePath(cleanPath(path))) },
      props: this.passedProps
    }
  }
  /*
    Produces the dependency map to register the compute in the
    dependency store with.
  */
  getDepsMap (model) {
    if (!this.depsMap) {
      this.depsMap = Object.keys(this.paths).reduce((currentDepsMap, depsMapKey) => {
        if (this.paths[depsMapKey] instanceof Computed) {
          return Object.assign(currentDepsMap, this.paths[depsMapKey].getDepsMap(model))
        } else if (typeof this.paths[depsMapKey] === 'string') {
          console.warn('You are defining paths with a string in a Computed, use a STATE TAG instead')
          currentDepsMap[depsMapKey] = this.paths[depsMapKey]
        } else {
          const getters = this.createTagGetters(model)

          currentDepsMap = this.paths[depsMapKey].getTags(getters).reduce((depsMap, tag) => {
            const path = tag.getPath(getters)

            depsMap[path] = path

            return depsMap
          }, currentDepsMap)
        }

        return currentDepsMap
      }, {})
    }

    return this.depsMap
  }
  /*
    Produces a new value if the computed is dirty or returns existing
    value
  */
  getValue (model) {
    if (!this.isRegistered) {
      dependencyStore.addEntity(this, this.depsMap || this.getDepsMap(model))
      this.isRegistered = true
    }

    if (this.isDirty) {
      const computedProps = Object.assign(
        {},
        this.passedProps,
        Object.keys(this.paths).reduce((currentProps, depsMapKey) => {
          if (this.paths[depsMapKey] instanceof Computed) {
            currentProps[depsMapKey] = this.paths[depsMapKey].getValue(model)
          } else if (typeof this.paths[depsMapKey] === 'string') {
            currentProps[depsMapKey] = model.get(ensurePath(cleanPath(this.paths[depsMapKey])))
          } else {
            currentProps[depsMapKey] = this.paths[depsMapKey].getValue(this.createTagGetters(model))
          }

          return currentProps
        }, {})
      )
      this.value = this.func(computedProps)
      this.isDirty = false
    }

    return this.value
  }
  /*
    When a component unmounts it will call this method on any
    attached computeds. It removes any attached computeds
    to the computed and also from the factory cache
  */
  remove () {
    dependencyStore.removeEntity(this, this.depsMap)
    Object.keys(this.paths).forEach((pathKey) => {
      if (this.paths[pathKey] instanceof Computed) {
        this.paths[pathKey].remove()
      }
    })
    this.factory.removeFromCache(this)
  }
}

/*
  A factory instance allows you to produce computeds. It holds a
  cache in case the the same computed is used multiple places. This
  is what is created when you actually create a computed.
*/
class ComputedFactory {
  constructor (paths, func) {
    if (
      !(
        isObject(paths) ||
        typeof paths === 'function'
      ) ||
      typeof func !== 'function'
    ) {
      throwError('You are not passing the correct arguments to the computed factory')
    }
    this.paths = paths
    this.func = func
    this.cache = []

    return this.create()
  }
  /*
    This is what runs when you create an instance of a computed, passing
    any optional props. It checks the cache or creates a new computed
  */
  create (props = {}) {
    if (!isObject(props)) {
      throwError('You are not passing valid props to a computed')
    }
    for (let x = 0; x < this.cache.length; x++) {
      if (!propsDiffer(props, this.cache[x].props)) {
        return this.cache[x]
      }
    }

    const computedInstance = new Computed(props, this)
    this.cache.push(computedInstance)

    return computedInstance
  }
  /*
    Called by each computed when removed to clean up cache
  */
  removeFromCache (computedInstance) {
    this.cache.splice(this.cache.indexOf(computedInstance), 1)
  }
}

export default function computed (paths, func) {
  return new ComputedFactory(paths, func)
}
