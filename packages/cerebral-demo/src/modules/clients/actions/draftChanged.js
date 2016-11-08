function draftChanged ({state, path}) {
  const draft = state.get('clients.$draft')
  if (!draft) {
    return path.false()
  }

  const client = state.get(`clients.all.${draft.ref}`)

  Object.keys(Object.assign({}, draft, client)).forEach(key => {
    if (draft[key] !== client[key]) {
      return path.false()
    }
  })

  return path.true()
}

export default draftChanged
