export function convertObjectWithTemplates (obj, context) {
  if (typeof obj === 'function') {
    return obj(context).value
  }

  return Object.keys(obj).reduce((convertedObject, key) => {
    convertedObject[key] = typeof obj[key] === 'function' ? obj[key](context).value : obj[key]

    return convertedObject
  }, {})
}
