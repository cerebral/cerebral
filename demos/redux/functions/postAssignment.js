function postAssignment({axios, getState, path}) {
  const state = getState();
  const assignment = {
    title: state.newAssignmentTitle,
    assignedTo: state.newAssigmentAssignees.map(user => user.id)
  };

  return axios.post('/assignments', assignment)
    .then(({status, data}) => path.success({status, data}))
    .catch(({status, data}) => path.error({status, data}));
}

export default postAssignment;
