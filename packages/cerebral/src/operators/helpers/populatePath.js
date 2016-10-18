export default function populatePath (context, strings, values) {
  return strings.reduce((currentPath, string) => {
    if (!string) {
      return currentPath + values.shift()(context).toValue()
    }

    return currentPath + string
  }, '')
}
