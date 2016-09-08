import setView from '../factories/setView';
import postAssignment from '../functions/postAssignment';
import getMissingUsers from '../compositions/getMissingUsers';

export default [
  setView('isPostingAssignment', true),
  postAssignment, {
    success: [
      setView('isPostingAssignment', false),
      ...getMissingUsers
    ],
    error: [
      setView('error', 'Could not post assignment')
    ]
  }
];
