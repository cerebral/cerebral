import set from 'function-tree/operators/set';
import postAssignment from '../functions/postAssignment';
import getMissingUsers from '../compositions/getMissingUsers';

export default [
  set('view.isPostingAssignment', true),
  postAssignment, {
    success: [
      set('view.isPostingAssignment', false),
      ...getMissingUsers
    ],
    error: [
      set('view.error', 'Could not post assignment')
    ]
  }
];
