import dispatch from '../functions/factories/dispatch';
import hasAssignee from '../functions/hasAssignee';
import {
  NEW_ASSIGNMENT_ASSIGNEE_ADDED
} from '../constants';

export default [
  hasAssignee, {
    true: [
      dispatch(NEW_ASSIGNMENT_ASSIGNEE_ADDED)
    ],
    false: []
  }
];
