import updateField from './signals/updateField'
import createFirebaseUser from './signals/createFirebaseUser'
import signInWithFirebase from './signals/signInWithFirebase'
import signOutFirebase from './signals/signOutFirebase'

export default {
  state: {
    lang: 'en',
    $loggedIn: false,
    $signIn: {
      email: '',
      password: ''
    },
    $currentUser: null
  },
  signals: {
    fieldChanged: [
      updateField
    ],
    createUserClicked: createFirebaseUser,
    signInClicked: signInWithFirebase,
    signOutClicked: signOutFirebase
  }
}
