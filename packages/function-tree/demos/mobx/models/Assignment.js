class Assignment {
  constructor (title, assignees) {
    this.title = title
    this.assignedTo = assignees
  }

  toJS () {
    return {
      title: this.title,
      assignedTo: this.assignees.map(user => user.id)
    }
  }
}

export default Assignment
