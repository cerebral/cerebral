function saveDraft ({state, path}) {
  const draft = state.get('projects.$draft')

  state.set(`projects.all.${draft.ref}`, draft)

  return path.success()
}

export default saveDraft
