export default function populatePath (context, strings, values) {
  return strings.reduce((currentPath, string, idx) => {
    const valueTemplate = values[idx]
    if (valueTemplate && valueTemplate.getValue && !context.state.compute) {
      throw Error('Sorry, we were not able to migrate computed in tag operators')
    }

    if (valueTemplate && valueTemplate.getValue) {
      return currentPath + string + context.state.compute(valueTemplate)
    }

    if (valueTemplate && typeof valueTemplate === 'function') {
      return currentPath + string + valueTemplate(context).value
    }

    return currentPath + string + (valueTemplate || '')
  }, '')
}
