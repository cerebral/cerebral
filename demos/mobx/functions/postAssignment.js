function postAssignment({axios, view, result}) {
  const assignment = {
    title: view.newAssignmentTitle,
    assignedTo: view.newAssigmentAssignees.map(user => user.id)
  };

  return axios.post('/assignments', assignment)
    .then(({status, data}) => result.success({status, data}))
    .catch(({status, data}) => result.error({status, data}));
}

export default postAssignment;
