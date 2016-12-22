export default function extractValueWithPath (obj, path) {
  return path.split('.').reduce((currentValue, key) => {
    if (currentValue[key] === undefined) {
      throw new Error(`A tag is extracting "${path}", but it is not valid`)
    }
    return currentValue[key]
  }, obj)
}
