import {observable} from 'mobx';
import Assignment from '../models/Assignment';

class DataStore {
  @observable
  assignments = [];

  users = {};

  addAssignment(title, assignedTo) {
    const assignees = assignedTo.map(userId => this.users[userId]);

    this.assignments.push(new Assignment(title, assignees));
  }
  addUsers(users) {
    users.forEach(user => {
      this.users[user.id] = user;
    });
  }
}

export default DataStore;
