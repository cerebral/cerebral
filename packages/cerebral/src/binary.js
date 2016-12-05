let referenceRefCount = 0
const storage = {}

export default {
  push (binary, fixedRef = null) {
    const ref = `binary-ref-${fixedRef || ++referenceRefCount}`
    storage[ref] = binary
    return ref
  },
  pop (ref) {
    const binary = storage[ref]
    delete storage[ref]
    return binary
  }
}
