const cache = {}

export default {
  get (query) {
    return cache[query]
  },
  add (query, data) {
    return cache[query] = data
  }
}
