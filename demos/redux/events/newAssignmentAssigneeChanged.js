import dispatch from '../functions/factories/dispatch';
import debounce from 'function-tree/operators/debounce';
import filter from 'function-tree/operators/filter';
import searchAssignee from '../functions/searchAssignee';

import {
  NEW_ASSIGNMENT_ASSIGNEE_CHANGED,
  ASSIGNEE_SEARCHING,
  ASSIGNEE_SEARCHED_SUCCESS,
  ASSIGNEE_SEARCHED_ERROR,
  ASSIGNEE_SEARCH_RESET
} from '../constants';

export default [
  dispatch(NEW_ASSIGNMENT_ASSIGNEE_CHANGED),
  debounce(500, [
    filter('input.value'), {
      accepted: [
        dispatch(ASSIGNEE_SEARCHING),
        searchAssignee, {
          success: [
            dispatch(ASSIGNEE_SEARCHED_SUCCESS)
          ],
          error: [
            dispatch(ASSIGNEE_SEARCHED_ERROR)
          ]
        }
      ],
      discarded: [
        dispatch(ASSIGNEE_SEARCH_RESET)
      ]
    }
  ])
];
