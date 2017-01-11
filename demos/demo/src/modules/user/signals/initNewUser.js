import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import {set as setRemote} from 'cerebral-provider-firebase'
import firebaseInit from '../../app/signals/firebaseInit'
import paths from '../../../common/Collection/paths'

const signInPath = 'user.$signIn'
const {dynamicPaths} = paths('user')
const createFirebaseUser = [
  {
    success: [
      set(state`${signInPath}.email.value`, ''),
      set(state`${signInPath}.password.value`, ''),
      set(state`${signInPath}.validationErrors`, {}),
      set(state`${signInPath}.error`, ''),
      set(state`user.$loggedIn`, true),
      set(state`user.$currentUser`, input`user`),
      // Create initial state for user
      set(input`value`, {
        created_at: {'.sv': 'timestamp'},
        updated_at: {'.sv': 'timestamp'}
      }),
      set(input`value.email`, input`user.email`),
      ...dynamicPaths,
      setRemote(input`remoteCollectionPath`, input`value`), {
        success: [],
        error: [
          set(state`${signInPath}.error`, input`error`)
        ]
      },
      ...firebaseInit
    ],
    invalid: [
      set(state`${signInPath}.validationErrors`, input`validationErrors`),
      set(state`${signInPath}.error`, '')
    ],
    error: [
      set(state`${signInPath}.email.value`, ''),
      set(state`${signInPath}.password.value`, ''),
      set(state`${signInPath}.validationErrors`, {}),
      set(state`${signInPath}.error`, input`error`)
    ]
  }
]

export default createFirebaseUser
