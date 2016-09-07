import {observable} from 'mobx';

class ViewStore {
  title = 'Assignments';

  @observable
  isLoadingAssignments = false;

  @observable
  error = null;

  @observable
  newAssignmentTitle = '';

  @observable
  newAssignmentAssignee = '';

  @observable
  assigneeSearchResult = null;

  @observable
  isSearching = false;

  @observable
  newAssigmentAssignees = [];

  @observable
  isPostingAssignment = false;
}

export default ViewStore;
