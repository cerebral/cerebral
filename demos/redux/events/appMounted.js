import httpGet from '../functions/factories/httpGet';
import dispatch from '../functions/factories/dispatch';
import getMissingUsers from '../compositions/getMissingUsers';
import {
  ASSIGNMENTS_LOADING,
  ASSIGNMENTS_LOADED_SUCCESS,
  ASSIGNMENTS_LOADED_ERROR
} from '../constants';

export default [
  dispatch(ASSIGNMENTS_LOADING),
  httpGet('/assignments'), {
    success: [
      dispatch(ASSIGNMENTS_LOADED_SUCCESS),
      ...getMissingUsers
    ],
    error: [
      dispatch(ASSIGNMENTS_LOADED_ERROR)
    ]
  }
];
