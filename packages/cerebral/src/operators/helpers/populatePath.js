export default function populatePath (context, strings, values) {
  return strings.reduce((currentPath, string, idx) => {
    const valueTemplate = values[idx]
    const value = valueTemplate ? valueTemplate(context).toValue() : ''
    return currentPath + string + value
  }, '')
}
