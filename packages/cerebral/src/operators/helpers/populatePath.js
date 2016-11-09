export default function populatePath (context, strings, values) {
  return strings.reduce((currentPath, string, idx) => {
    const valueTemplate = values[idx]
    if (valueTemplate && valueTemplate.getValue) {
      return currentPath + string + context.state.compute(valueTemplate)
    }

    return currentPath + string + (valueTemplate ? valueTemplate(context).toValue() : '')
  }, '')
}
