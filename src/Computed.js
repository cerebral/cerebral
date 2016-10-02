import DependencyStore from './DependencyStore'
import {cleanPath, isObject, throwError, propsDiffer} from './utils'

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
  constructor (props, paths, func, depsMap, factory) {
    if (!isObject(props)) {
      throwError('You are not passing valid props to a computed')
    }
    this.props = props
    this.func = func
    this.value = null
    this.paths = paths
    this.depsMap = depsMap
    this.factory = factory

    this.isDirty = true

    dependencyStore.addEntity(this, this.depsMap)
  }
  /*
    This method is called by the controller when a flush happens and
    the dependency store returns affected computeds
  */
  flag () {
    this.isDirty = true
  }
  /*
    Produces a new value if the computed is dirty or returns existing
    value
  */
  getValue (controller) {
    if (this.isDirty) {
      const computedProps = Object.assign(
        {},
        this.props,
        Object.keys(this.paths).reduce((currentProps, depsMapKey) => {
          currentProps[depsMapKey] = (
            this.paths[depsMapKey] instanceof Computed
              ? this.paths[depsMapKey].getValue(controller)
              : controller.getState(cleanPath(this.paths[depsMapKey]))
          )

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
      !paths ||
      (
        !isObject(paths) &&
        typeof paths !== 'function'
      ) ||
      !func ||
      typeof func !== 'function'
    ) {
      throwError('You are not passing the correct arguments to the computed factory')
    }
    this.paths = paths
    this.func = func
    this.cache = []

    const create = this.create.bind(this)
    create.cache = this.cache

    return create
  }
  /*
    This is what runs when you create an instance of a computed, passing
    any optional props. It checks the cache or creates a new computed
  */
  create (props = {}) {
    const paths = typeof this.paths === 'function' ? this.paths(props) : this.paths
    const depsMap = this.getDepsMap(paths)

    for (let x = 0; x < this.cache.length; x++) {
      if (!propsDiffer(props, this.cache[x].props)) {
        return this.cache[x]
      }
    }

    const computedInstance = new Computed(props, paths, this.func, depsMap, this)
    this.cache.push(computedInstance)

    return computedInstance
  }
  /*
    Produces the dependency map to register the compute in the
    dependency store with.
  */
  getDepsMap (paths) {
    return Object.keys(paths).reduce((currentDepsMap, depsMapKey) => {
      if (paths[depsMapKey] instanceof Computed) {
        return Object.assign(currentDepsMap, paths[depsMapKey].depsMap)
      }
      currentDepsMap[depsMapKey] = paths[depsMapKey]

      return currentDepsMap
    }, {})
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
