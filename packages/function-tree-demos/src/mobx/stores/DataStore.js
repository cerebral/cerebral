import {extendObservable, map} from 'mobx'
import Assignment from '../models/Assignment'

class DataStore {
  constructor () {
    extendObservable(this, {
      assignments: []
    })
  }

  users = map({});

  addAssignment (title, assignedTo) {
    this.assignments.unshift(new Assignment(title, assignedTo))
  }
  updateAssignmentId (id) {
    this.assignments[0].id = id
  }
  addUsers (users) {
    users.forEach(user => {
      this.users.set(user.id, user)
    })
  }
}

export default DataStore
