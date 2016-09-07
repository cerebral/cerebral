import copy from 'function-tree/operators/copy';
import set from 'function-tree/operators/set';
import debounce from 'function-tree/operators/debounce';
import filter from 'function-tree/operators/filter';
import searchAssignee from '../functions/searchAssignee';

export default [
  copy('input.value', 'view.newAssignmentAssignee'),
  debounce(500, [
    filter('input.value'), {
      accepted: [
        set('view.isSearching', true),
        searchAssignee, {
          success: [
            copy('input.assignee', 'view.assigneeSearchResult'),
            set('view.isSearching', false)
          ],
          error: [
            set('view.error', 'Could not search assignee')
          ]
        }
      ],
      discarded: [
        set('view.assigneeSearchResult', null)
      ]
    }
  ])
];
