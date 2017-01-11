import {set} from 'cerebral/operators'
import {input, state} from 'cerebral/tags'
import {isValidForm} from 'cerebral-forms'
import signIn from '../actions/signIn'
import firebaseInit from '../../app/signals/firebaseInit'

const signInWithFirebase = [
  isValidForm('user.$signIn'), {
    true: [
      signIn, {
        success: [
          set(state`user.$loggedIn`, true),
          set(state`user.$signIn.email.value`, ''),
          set(state`user.$signIn.password.value`, ''),
          set(state`user.$currentUser`, input`user`),
          set(state`user.$signIn.error`, ''),
          ...firebaseInit
        ],
        error: [
          set(state`user.$signIn.password.value`, ''),
          set(state`user.$signIn.error`, input`error`)
        ]
      }
    ],
    false: [
      set(state`user.$signIn.showErrors`, true)
    ]
  }
]

export default signInWithFirebase
