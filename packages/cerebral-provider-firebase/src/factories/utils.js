export function convertObjectWithTemplates (obj, resolveArg) {
  if (resolveArg.isTag(obj)) {
    return resolveArg.value(obj)
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = resolveArg.value(obj[key])

    return convertedObject
  }, {})
}
