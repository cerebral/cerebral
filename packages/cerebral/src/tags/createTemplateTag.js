import extractValueWithPath from './extractValueWithPath'
import populatePath from './populatePath'
import getTags from './getTags'

export default (tag) => {
  return (strings, ...values) => {
    return (getters) => {
      return {
        target: tag,
        get tags() {
          return [this].concat(getTags(getters, strings, values))
        },
        get path() {
          return populatePath(getters, strings, values)
        },
        get value() {
          if (!getters[tag]) {
            throw new Error(`Tag of type ${tag.toUpperCase()} can not be used in this context`)
          }

          return typeof getters[tag] === 'function' ? getters[tag](this.path) : extractValueWithPath(getters[tag], this.path)
        }
      }
    }
  }
}
