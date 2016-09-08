import {
  USERS_LOADED_SUCCESS,
  USERS_LOADED_ERROR
} from '../constants';
import dispatch from '../factories/dispatch';
import getMissingUsers from '../functions/getMissingUsers';

export default [
  getMissingUsers, {
    success: [
      dispatch(USERS_LOADED_SUCCESS)
    ],
    error: [
      dispatch(USERS_LOADED_ERROR)
    ]
  }
];
