export default function getPaths (getters, strings, values) {
  return strings.reduce((currentPaths, string, idx) => {
    const valueTemplate = values[idx]

    if (typeof valueTemplate === 'function') {
      return currentPaths.concat(valueTemplate(getters))
    }

    return currentPaths
  }, [])
}
