export function convertObjectWithTemplates (obj, resolve) {
  if (resolve.isTag(obj)) {
    return resolve.value(obj)
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = resolve.value(obj[key])

    return convertedObject
  }, {})
}
