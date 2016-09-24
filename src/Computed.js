import DependencyStore from './DependencyStore'
import {cleanPath, isObject, throwError} from './utils'

export const dependencyStore = new DependencyStore()

export class Computed {
  constructor(props, paths, func) {
    if (!isObject(props)) {
      throwError('You are not passing valid props to a computed')
    }
    this.props = props
    this.func = func
    this.value = null
    this.paths = typeof paths === 'function' ? paths(props) : paths
    this.depsMap = Object.keys(this.paths).reduce((currentDepsMap, depsMapKey) => {
      if (this.paths[depsMapKey] instanceof Computed) {
        return Object.assign(currentDepsMap, this.paths[depsMapKey].depsMap)
      }
      currentDepsMap[depsMapKey] = this.paths[depsMapKey]

      return currentDepsMap
    }, {})

    this.isDirty = true

    dependencyStore.addEntity(this, this.depsMap)
  }
  flag() {
    this.isDirty = true
  }
  getValue(controller) {
    if (this.isDirty) {
      const computedProps = Object.assign(
        {},
        this.props,
        Object.keys(this.paths).reduce((currentProps, depsMapKey) => {
          currentProps[depsMapKey] = (
            this.paths[depsMapKey] instanceof Computed ?
              this.paths[depsMapKey].getValue(controller)
            :
              controller.getState(cleanPath(this.paths[depsMapKey]))
          )

          return currentProps
        }, {})
      )
      this.value = this.func(computedProps)
      this.isDirty = false
    }

    return this.value
  }
  remove() {
    dependencyStore.removeEntity(this, this.depsMap)
    Object.keys(this.paths).forEach((pathKey) => {
      if (this.paths[pathKey] instanceof Computed) {
        this.paths[pathKey].remove()
      }
    })
  }
}

class ComputedFactory {
  constructor(paths, func) {
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

    return this.create.bind(this)
  }
  create(props = {}) {
    return new Computed(props, this.paths, this.func)
  }
}

export default (paths, func) => {
  return new ComputedFactory(paths, func)
}
