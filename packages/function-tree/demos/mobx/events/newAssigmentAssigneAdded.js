import setView from '../factories/setView';
import addAssignee from '../functions/addAssignee';

export default [
  addAssignee,
  setView('assigneeSearchResult', null),
  setView('newAssignmentAssignee', '')
];
