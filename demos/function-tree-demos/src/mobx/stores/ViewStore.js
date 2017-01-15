import {extendObservable} from 'mobx'

class ViewStore {
  title = 'Assignments';

  constructor () {
    extendObservable(this, {
      isLoadingAssignments: false,
      error: null,
      newAssignmentTitle: '',
      newAssignmentAssignee: '',
      assigneeSearchResult: null,
      isSearching: false,
      newAssigmentAssignees: [],
      isPostingAssignment: false
    })
  }

  addAssignee () {
    this.newAssigmentAssignees = this.newAssigmentAssignees.concat(this.assigneeSearchResult)
  }
}

export default ViewStore
