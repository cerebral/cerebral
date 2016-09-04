function postAssignment({axios, getState, result}) {
  const state = getState();
  const assignment = {
    title: state.newAssignmentTitle,
    assignedTo: state.newAssigmentAssignees.map(user => user.id)
  };

  return axios.post('/assignments', assignment)
    .then(({status, data}) => result.success({status, data}))
    .catch(({status, data}) => result.error({status, data}));
}

export default postAssignment;
