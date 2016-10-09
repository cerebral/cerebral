function postAssignment({axios, view, path}) {
  const assignment = {
    title: view.newAssignmentTitle,
    assignedTo: view.newAssigmentAssignees.map(user => user.id)
  };

  return axios.post('/assignments', assignment)
    .then(({status, data}) => path.success({status, data}))
    .catch(({status, data}) => path.error({status, data}));
}

export default postAssignment;
