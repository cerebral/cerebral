export default function firebaseItemRemoved (statePath) {
  return function removeItem ({ input, state }) {
    state.unset(`${statePath}.${input.key || input.id}`)
  }
}

