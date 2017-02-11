import {dependencyMatch, getWithPath, ensureStrictPath} from './utils'

class DependencyTracker {
  constructor (computed) {
    this.propsTrackMap = {}
    this.stateTrackMap = {}
    this.propsTrackFlatMap = {}
    this.stateTrackFlatMap = {}
    this.computed = computed
    this.value = null
  }

  run (stateGetter, props) {
    const newStateTrackMap = {}
    const newPropsTrackMap = {}
    const newPropsTrackFlatMap = {}
    const newStateTrackFlatMap = {}
    const stateTrackFlatMap = this.stateTrackFlatMap
    const propsTrackFlatMap = this.propsTrackFlatMap
    const propsGetter = getWithPath(props)
    let hasChanged = false

    this.value = this.computed.getValue({
      state (path) {
        const value = stateGetter(path)
        const strictPath = ensureStrictPath(path, value)
        const strictPathArray = strictPath.split('.')

        newStateTrackFlatMap[strictPath] = true

        if (!stateTrackFlatMap[strictPath]) hasChanged = true

        strictPathArray.reduce((currentNewStateTrackMapLevel, key, index) => {
          if (!currentNewStateTrackMapLevel[key]) {
            currentNewStateTrackMapLevel[key] = {}
          }

          if (index < strictPathArray.length - 1) {
            currentNewStateTrackMapLevel[key].children = currentNewStateTrackMapLevel[key].children || {}
          }

          return currentNewStateTrackMapLevel[key].children
        }, newStateTrackMap)

        return value
      },
      props (path) {
        const pathArray = path.split('.')
        newPropsTrackFlatMap[path] = true

        if (!propsTrackFlatMap[path]) hasChanged = true

        pathArray.reduce((currentNewPropsTrackMapLevel, key, index) => {
          if (!currentNewPropsTrackMapLevel[key]) {
            hasChanged = true
            currentNewPropsTrackMapLevel[key] = {}
          }

          if (index < pathArray.length - 1) {
            currentNewPropsTrackMapLevel[key].children = currentNewPropsTrackMapLevel[key].children || {}
          }

          return currentNewPropsTrackMapLevel[key].children
        }, newPropsTrackMap)

        return propsGetter(path)
      }
    })

    this.stateTrackMap = newStateTrackMap
    this.propsTrackMap = newPropsTrackMap
    this.stateTrackFlatMap = newStateTrackFlatMap
    this.propsTrackFlatMap = newPropsTrackFlatMap

    return hasChanged
  }

  match (stateChanges, propsChanges) {
    return (
      Boolean(dependencyMatch(stateChanges, this.stateTrackMap).length) ||
      Boolean(dependencyMatch(propsChanges, this.propsTrackMap).length)
    )
  }
}

export default DependencyTracker
