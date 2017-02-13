export default function firebaseItemChanged (statePath) {
  return function mergeItem ({ state, props }) {
    const { key, value } = props
    state.set(`${statePath}.${key}`, value)
    return { key }
  }
}
