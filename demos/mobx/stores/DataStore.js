import {observable, map} from 'mobx';
import Assignment from '../models/Assignment';

class DataStore {
  @observable
  assignments = [];

  users = map({});

  addAssignment(title, assignedTo) {
    this.assignments.unshift(new Assignment(title, assignedTo));
  }
  updateAssignmentId(id) {
    this.assignments[0].id = id;
  }
  addUsers(users) {
    users.forEach(user => {
      this.users.set(user.id, user);
    });
  }
  set(prop, value) {
    this[prop] = value;
  }
}

export default DataStore;
