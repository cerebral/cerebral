import dispatch from '../functions/factories/dispatch';
import postAssignment from '../functions/postAssignment';
import getMissingUsers from '../compositions/getMissingUsers';
import {
  POSTING_ASSIGNMENT,
  POSTED_ASSIGNMENT_SUCCESS,
  POSTED_ASSIGNMENT_ERROR
} from '../constants';

export default [
  dispatch(POSTING_ASSIGNMENT),
  postAssignment, {
    success: [
      dispatch(POSTED_ASSIGNMENT_SUCCESS),
      ...getMissingUsers
    ],
    error: [
      dispatch(POSTED_ASSIGNMENT_ERROR)
    ]
  }
];
