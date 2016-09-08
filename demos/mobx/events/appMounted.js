import setView from '../factories/setView';
import copyInputToData from '../factories/copyInputToData';
import httpGet from '../factories/httpGet';
import getMissingUsers from '../compositions/getMissingUsers';

export default [
  setView('isLoadingAssignments', true),
  httpGet('/assignments'), {
    success: [
      setView('isLoadingAssignments', false),
      copyInputToData('data', 'assignments'),
      ...getMissingUsers
    ],
    error: [
      setView('error', 'Could not load assignments')
    ]
  }
];
