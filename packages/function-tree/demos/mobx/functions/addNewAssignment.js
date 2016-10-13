function addNewAssignment ({data, view}) {
  data.addAssignment(
    view.newAssignmentTitle,
    view.newAssigmentAssignees.map(user => user.id)
  )
}

export default addNewAssignment
