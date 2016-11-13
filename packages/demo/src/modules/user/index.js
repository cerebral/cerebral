import updateField from './signals/updateField'
import createUser from './actions/createUser'
import signIn from './actions/signIn'
import {input, set, state} from 'cerebral/operators'
import signOut from './actions/signOut'

export default {
  state: {
    $loggedIn: false,
    lang: 'en',
    signIn: {
      $email: '',
      $password: ''
    },
    currentUser: null
  },
  signals: {
    fieldChanged: updateField,
    createUserClicked: [
      createUser, {
        success: [],
        error: []
      }
    ],
    signInClicked: [
      signIn, {
        success: [
          set(state`user.$loggedIn`, true),
          set(state`user.signIn.$email`, ''),
          set(state`user.signIn.$password`, ''),
          set(state`user.currentUser`, input`user`)
        ],
        error: []
      }
    ],
    signOutClicked: [
      signOut, {
        success: [
          set(state`user.$loggedIn`, false),
          set(state`user.signIn.$email`, ''),
          set(state`user.signIn.$password`, ''),
          set(state`user.currentUser`, null)
        ],
        error: []
      }
    ]
  }
}
