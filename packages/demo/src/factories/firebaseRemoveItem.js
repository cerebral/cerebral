function firebaseRemoveItem (statePath) {
  return function removeItem ({ input, state }) {
    state.unset(`${statePath}.${input.key || input.id}`)
  }
}

export default firebaseRemoveItem
