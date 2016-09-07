import getMissingUsers from '../functions/getMissingUsers';

export function setMissingUsers({input, data}) {
  data.addUsers(input.data);
}

export function setMissingUsersError({view}) {
  view.setError('Could not load missing users');
}

export default [
  getMissingUsers, {
    success: [
      setMissingUsers
    ],
    error: [
      setMissingUsersError
    ]
  }
];
