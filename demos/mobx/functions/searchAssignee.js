function searchAssignee({input, axios, result}) {
  return axios.get(`/users?name=${input.value}`)
    .then(response => result.success({assignee: response.data}))
    .catch(error => result.error({error: error.response.data}));
}

export default searchAssignee;
