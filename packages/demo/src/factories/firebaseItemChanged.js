export default function firebaseItemChanged (statePath) {
  return function mergeItem ({ state, input }) {
    const { key, value } = input
    state.set(`${statePath}.${key}`, value)
    return { key }
  }
}
