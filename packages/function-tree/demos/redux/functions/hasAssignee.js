function hasAssignee ({getState, path}) {
  if (getState().assigneeSearchResult) {
    return path.true()
  }

  return path.false()
}

export default hasAssignee
