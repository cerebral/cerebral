import setView from '../factories/setView';
import postAssignment from '../functions/postAssignment';
import getMissingUsers from '../compositions/getMissingUsers';
import addNewAssignment from '../functions/addNewAssignment';
import updateAssignmentId from '../functions/updateAssignmentId';

export default [
  setView('isPostingAssignment', true),
  addNewAssignment,
  postAssignment, {
    success: [
      updateAssignmentId,
      setView('isPostingAssignment', false),
      setView('newAssignmentTitle', ''),
      setView('newAssignmentAssignee', ''),
      setView('newAssigmentAssignees', []),
      ...getMissingUsers
    ],
    error: [
      setView('error', 'Could not post assignment')
    ]
  }
];
