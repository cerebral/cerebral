export default function resolveTranslation(obj, str) {
  const a = str.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i]
    if (k in obj) {
      obj = obj[k]
    } else {
      return
    }
  }
  return obj
}
