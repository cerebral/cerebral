import {set, state, input} from 'cerebral/operators'
import createUser from '../actions/createUser'
import firebaseInit from '../../app/signals/firebaseInit'

const createFirebaseUser = [
  createUser, {
    success: [
      set(state`user.$loggedIn`, true),
      set(state`user.$signIn.email`, ''),
      set(state`user.$signIn.password`, ''),
      set(state`user.$currentUser`, input`user`),
      set(state`user.$signIn.validationErrors`, {}),
      set(state`user.$signIn.error`, ''),
      ...firebaseInit
    ],
    invalid: [
      set(state`user.$signIn.validationErrors`, input`validationErrors`),
      set(state`user.$signIn.error`, '')
    ],
    error: [
      set(state`user.$signIn.validationErrors`, {}),
      set(state`user.$signIn.error`, input`error`)
    ]
  }
]

export default createFirebaseUser
