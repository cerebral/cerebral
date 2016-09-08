import setView from '../factories/setView';
import httpGet from '../factories/httpGet';
import getMissingUsers from '../compositions/getMissingUsers';

export default [
  setView('isLoadingAssignments', true),
  httpGet('/assignments'), {
    success: [
      setView('isLoadingAssignments', false),
      ...getMissingUsers
    ],
    error: [
      setView('error', 'Could not load assignments')
    ]
  }
];
