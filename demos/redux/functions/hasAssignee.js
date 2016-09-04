function hasAssignee({getState, result}) {
  if (getState().assigneeSearchResult) {
    return result.true();
  }

  return result.false();
}

export default hasAssignee;
