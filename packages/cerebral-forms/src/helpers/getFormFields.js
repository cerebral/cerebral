export default function getFormFields (object, currentPath = [], allFields = {}) {
  return Object.keys(object).reduce((allFields, key) => {
    currentPath.push(key)
    if (Array.isArray(object[key])) {
      object[key].forEach((formItem, index) => {
        currentPath.push(index)
        getFormFields(object[key][index], currentPath, allFields)
        currentPath.pop()
      })
      currentPath.pop()

      return allFields
    } else if ('value' in object[key]) {
      allFields[currentPath.join('.')] = object[key]
      currentPath.pop()

      return allFields
    }
    getFormFields(object[key], currentPath, allFields)
    currentPath.pop()

    return allFields
  }, allFields)
}
