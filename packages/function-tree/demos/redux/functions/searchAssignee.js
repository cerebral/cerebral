function searchAssignee({input, axios, path}) {
  return axios.get(`/users?name=${input.value}`)
    .then(response => path.success({assignee: response.data}))
    .catch(error => path.error({error: error.response.data}));
}

export default searchAssignee;
