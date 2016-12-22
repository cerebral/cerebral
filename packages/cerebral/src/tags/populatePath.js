export default function populatePath (getters, strings, values) {
  return strings.reduce((currentPath, string, idx) => {
    const valueTemplate = values[idx]

    if (typeof valueTemplate === 'function') {
      return currentPath + string + valueTemplate(getters).value
    }

    return currentPath + string + (valueTemplate || '');
  }, '')
}
