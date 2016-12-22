import {Tag} from 'cerebral/tags'

export function convertObjectWithTemplates (obj, tagGetters) {
  if (obj instanceof Tag) {
    return obj.getValue(tagGetters)
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = obj[key] instanceof Tag ? obj[key].getValue(tagGetters) : obj[key]

    return convertedObject
  }, {})
}
