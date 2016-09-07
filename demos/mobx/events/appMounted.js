import set from 'function-tree/operators/set';
import httpGet from '../functions/factories/httpGet';
import getMissingUsers from '../compositions/getMissingUsers';

export default [
  set('view.isLoadingAssignments', true),
  httpGet('/assignments'), {
    success: [
      set('view.isLoadingAssignments', false),
      ...getMissingUsers
    ],
    error: [
      set('view.error', 'Could not load assignments')
    ]
  }
];
