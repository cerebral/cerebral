import signOut from '../actions/signOut'
import {set, state} from 'cerebral/operators'

const signOutFirebase = [
  signOut, {
    success: [
      set(state`user.$loggedIn`, false),
      set(state`user.$signIn.email`, ''),
      set(state`user.$signIn.password`, ''),
      set(state`user.$currentUser`, null)
    ],
    error: []
  }
]

export default signOutFirebase
