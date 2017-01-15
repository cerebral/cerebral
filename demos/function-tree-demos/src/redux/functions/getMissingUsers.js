function getMissingUsers ({axios, getState, path}) {
  const users = getState().users
  const assignments = getState().assignments
  const missingUsersId = assignments.reduce((currentMissingUsersId, assignment) => {
    return assignment.assignedTo.reduce((currentMissingAssigneeId, assigneeId) => {
      if (!users[assigneeId] && currentMissingAssigneeId.indexOf(assigneeId) === -1) {
        return currentMissingAssigneeId.concat(assigneeId)
      }

      return currentMissingAssigneeId
    }, currentMissingUsersId)
  }, [])
  const missingUsersRequest = missingUsersId.map((userId) => {
    return axios.get(`/users/${userId}`)
  })

  return Promise.all(missingUsersRequest)
    .then((responses) => {
      const missingUsers = responses.map(response => response.data)

      return path.success({users: missingUsers})
    })
    .catch((error) => path.error({
      status: error.response.status,
      data: error.response.data
    }))
}

export default getMissingUsers
