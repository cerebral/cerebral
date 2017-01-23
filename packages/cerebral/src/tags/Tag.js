/*
  Creates tag for targetting things with a path in Cerebral
*/
export default class Tag {
  constructor (tag, options = {}, strings, values) {
    options.hasValue = options.hasValue === undefined ? true : options.hasValue

    this.type = tag
    this.options = options
    this.strings = strings
    this.values = values
  }
  /*
    Returns all tags, also nested to identify nested state dependencies
    in components
  */
  getTags () {
    return [this].concat(this.getNestedTags())
  }
  /*
    Gets the path of the tag, where nested tags are evaluated
  */
  getPath (getters) {
    if (!getters) {
      throw new Error('You can not grab the path from a Tag without getters')
    }

    return this.populatePath(getters)
  }
  /*
    Uses the path of the tag to look it up in related getter
  */
  getValue (getters) {
    if (!getters) {
      throw new Error('You can not grab a value from a Tag without getters')
    }

    if (this.options.hasValue && !getters[this.type]) {
      throw new Error(`Tag of type ${this.type.toUpperCase()} can not be used in this context`)
    }

    if (this.options.hasValue) {
      return typeof getters[this.type] === 'function' ? getters[this.type](this.getPath(getters)) : this.extractValueWithPath(getters[this.type], this.getPath(getters))
    } else {
      return this.getPath(getters)
    }
  }
  /*
    Extracts value from object using a path
  */
  extractValueWithPath (obj, path) {
    return path.split('.').reduce((currentValue, key, index) => {
      if (index > 0 && currentValue === undefined) {
        throw new Error(`A tag is extracting with path "${path}", but it is not valid`)
      }

      return currentValue[key]
    }, obj)
  }
  /*
    Grab nested tags from the tags current path
  */
  getNestedTags () {
    return this.strings.reduce((currentPaths, string, idx) => {
      const valueTemplate = this.values[idx]

      if (valueTemplate instanceof Tag) {
        return currentPaths.concat(valueTemplate)
      }

      return currentPaths
    }, [])
  }
  /*
    Populates nested tags in the tags path
  */
  populatePath (getters) {
    return this.strings.reduce((currentPath, string, idx) => {
      const valueTemplate = this.values[idx]

      if (valueTemplate instanceof Tag) {
        return currentPath + string + valueTemplate.getValue(getters)
      }

      if (valueTemplate && valueTemplate.getValue) {
        valueTemplate.flagAll()

        return currentPath + string + valueTemplate.getValue({
          get: getters.state
        })
      }

      return currentPath + string + (valueTemplate || '')
    }, '')
  }
  /*
    Produces a string representation of the tag
  */
  toString () {
    return this.type + '`' + this.pathToString() + '`'
  }
  /*
    Produces a string representation of the path
  */
  pathToString () {
    return this.strings.reduce((currentPath, string, idx) => {
      const valueTemplate = this.values[idx]

      if (valueTemplate instanceof Tag) {
        return currentPath + string + '${' + valueTemplate.toString() + '}'
      }

      return currentPath + string + (valueTemplate || '')
    }, '')
  }
}
