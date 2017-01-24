import {dependencyMatch, getWithPath, ensureStrictPath} from './utils'

class DependencyTracker {
  constructor (computed) {
    this.propsTrackMap = {}
    this.stateTrackMap = {}
    this.computed = computed
    this.value = null
  }

  run (stateGetter, props) {
    const newStateTrackMap = {}
    const newPropsTrackMap = {}
    const stateTrackMap = this.stateTrackMap
    const propsTrackMap = this.propsTrackMap
    const propsGetter = getWithPath(props)
    let hasChanged = false

    this.value = this.computed.getValue({
      state (path) {
        const value = stateGetter(path)
        const strictPath = ensureStrictPath(path, value)

        newStateTrackMap[strictPath] = true

        if (!stateTrackMap[strictPath]) hasChanged = true

        return value
      },
      props (path) {
        newPropsTrackMap[path] = true

        if (!propsTrackMap[path]) hasChanged = true

        return propsGetter(path)
      }
    })

    this.stateTrackMap = newStateTrackMap
    this.propsTrackMap = newPropsTrackMap

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
