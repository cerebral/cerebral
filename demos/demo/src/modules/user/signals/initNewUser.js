import {set} from 'cerebral/operators'
import {props, state} from 'cerebral/tags'
import * as firebase from 'cerebral-provider-firebase/operators'
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
      set(state`user.$currentUser`, props`user`),
      // Create initial state for user
      set(props`value`, {
        created_at: {'.sv': 'timestamp'},
        updated_at: {'.sv': 'timestamp'}
      }),
      set(props`value.email`, props`user.email`),
      ...dynamicPaths,
      firebase.set(props`remoteCollectionPath`, props`value`), {
        success: [],
        error: [
          set(state`${signInPath}.error`, props`error`)
        ]
      },
      ...firebaseInit
    ],
    invalid: [
      set(state`${signInPath}.validationErrors`, props`validationErrors`),
      set(state`${signInPath}.error`, '')
    ],
    error: [
      set(state`${signInPath}.email.value`, ''),
      set(state`${signInPath}.password.value`, ''),
      set(state`${signInPath}.validationErrors`, {}),
      set(state`${signInPath}.error`, props`error`)
    ]
  }
]

export default createFirebaseUser
