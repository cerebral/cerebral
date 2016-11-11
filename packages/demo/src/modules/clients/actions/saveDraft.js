function saveDraft ({state, path}) {
  const draft = state.get('clients.$draft')

  state.set(`clients.all.${draft.ref}`, draft)

  return path.success()
}

export default saveDraft
