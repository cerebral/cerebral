export default function getFormFields(
  object,
  currentPath = [],
  allFields = {}
) {
  return Object.keys(object).reduce((allFields, key) => {
    currentPath.push(key)
    if (Array.isArray(object[key])) {
      object[key].forEach((formItem, index) => {
        currentPath.push(index)
        getFormFields(object[key][index], currentPath, allFields)
        currentPath.pop()
      })
    } else if (object[key] === Object(object[key]) && 'value' in object[key]) {
      allFields[currentPath.join('.')] = object[key]
    } else if (object[key] === Object(object[key])) {
      getFormFields(object[key], currentPath, allFields)
    }
    currentPath.pop()

    return allFields
  }, allFields)
}
