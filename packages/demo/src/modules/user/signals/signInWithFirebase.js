import {set, state, input} from 'cerebral/operators'
import signIn from '../actions/signIn'

const signInWithFirebase = [
  signIn, {
    success: [
      set(state`user.$loggedIn`, true),
      set(state`user.signIn.$email`, ''),
      set(state`user.signIn.$password`, ''),
      set(state`user.currentUser`, input`user`),
      set(state`user.signIn.$validationsErrors`, {}),
      set(state`user.signIn.$error`, '')
    ],
    invalid: [
      set(state`user.signIn.$validationsErrors`, input`validationsErrors`),
      set(state`user.signIn.$error`, '')
    ],
    error: [
      set(state`user.signIn.$error`, input`error`),
      set(state`user.signIn.$validationsErrors`, {})
    ]
  }
]

export default signInWithFirebase
